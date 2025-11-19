#!/bin/bash

# Initialize PostgreSQL if not already initialized
if [ ! -f "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "Initializing PostgreSQL database..."
    sudo -u postgres initdb -D /var/lib/postgresql/data
    
    # Configure PostgreSQL
    echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
    echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf
    echo "port = 5432" >> /var/lib/postgresql/data/postgresql.conf
fi

# Start PostgreSQL in background
echo "Starting PostgreSQL..."
sudo -u postgres pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/data/logfile start

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z localhost 5432; do 
    echo "PostgreSQL is starting - sleeping"
    sleep 1
done

echo "PostgreSQL is ready!"

# Create database and user if they don't exist
sudo -u postgres psql -c "CREATE DATABASE IF NOT EXISTS tensillabs_lite;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER tensillabs WITH PASSWORD 'tensillabs_password';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tensillabs_lite TO tensillabs;" 2>/dev/null || true

# Set environment variables for the app
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_NAME=tensillabs_lite
export DATABASE_USER=tensillabs
export DATABASE_PASSWORD=tensillabs_password

echo "Starting the application..."
# Start the app
node dist/main
