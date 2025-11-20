#!/bin/bash
set -e

echo "=== TensilLabs Startup Script ==="
echo "Environment: ${NODE_ENV:-not set}"
echo "Port: ${PORT:-not set}"

# Set PostgreSQL environment for the postgres user
export PGDATA=/var/lib/postgresql/data

# Initialize PostgreSQL if not already initialized
if [ ! -f "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "Initializing PostgreSQL database..."
    sudo -u postgres /usr/lib/postgresql/*/bin/initdb -D /var/lib/postgresql/data
    
    echo "Configuring PostgreSQL..."
    echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
    echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf
    echo "port = 5432" >> /var/lib/postgresql/data/postgresql.conf
    echo "max_connections = 100" >> /var/lib/postgresql/data/postgresql.conf
    echo "shared_buffers = 128MB" >> /var/lib/postgresql/data/postgresql.conf
    echo "unix_socket_directories = '/var/run/postgresql'" >> /var/lib/postgresql/data/postgresql.conf
else
    echo "PostgreSQL data directory already initialized"
fi

# Ensure proper ownership
chown -R postgres:postgres /var/lib/postgresql/data /var/run/postgresql

# Start PostgreSQL
echo "Starting PostgreSQL..."
sudo -u postgres /usr/lib/postgresql/*/bin/pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/data/logfile start

# Wait for PostgreSQL with timeout
echo "Waiting for PostgreSQL to be ready..."
MAX_TRIES=30
TRIES=0
while ! nc -z localhost 5432; do 
    TRIES=$((TRIES + 1))
    if [ $TRIES -ge $MAX_TRIES ]; then
        echo "ERROR: PostgreSQL failed to start after $MAX_TRIES attempts"
        echo "=== PostgreSQL Log ==="
        cat /var/lib/postgresql/data/logfile 2>/dev/null || echo "No log file found"
        echo "=== PostgreSQL Status ==="
        sudo -u postgres /usr/lib/postgresql/*/bin/pg_ctl -D /var/lib/postgresql/data status || true
        exit 1
    fi
    echo "PostgreSQL is starting - attempt $TRIES/$MAX_TRIES"
    sleep 1
done

echo "PostgreSQL is ready!"

# Use environment variables from Fly secrets, with fallbacks
DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-tensillabs_lite}"
DB_USER="${DATABASE_USER:-tensillabs}"
DB_PASSWORD="${DATABASE_PASSWORD:-tensillabs_password}"

echo "Database configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

# Create database and user
echo "Setting up database and user..."
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
    
sudo -u postgres psql -c "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Grant schema permissions for the user
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

echo "Database setup complete!"

# Verify connection
echo "Testing database connection..."
if sudo -u postgres psql -h localhost -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "Database connection successful!"
else
    echo "WARNING: Database connection test failed, but continuing..."
fi

echo "Starting the application..."
cd /app
exec node apps/backend/dist/main
