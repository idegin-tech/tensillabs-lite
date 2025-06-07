# Fly.io Setup Instructions

## MongoDB Connection Setup

This project is configured to use Fly.io secrets for MongoDB connection in production and simple connection strings for development.

### Development
- Uses `mongodb://localhost:27017/tensillabs-lite` from `.env` file
- Can also use Docker Compose with `docker-compose up -d mongodb`

### Production (Fly.io)
Set your MongoDB connection string as a secret:

```bash
# Set the MongoDB URI as a secret
flyctl secrets set MONGODB_URI="mongodb://your-mongo-host:27017/tensillabs-lite"

# Or with authentication
flyctl secrets set MONGODB_URI="mongodb://username:password@your-mongo-host:27017/tensillabs-lite"

# View current secrets
flyctl secrets list

# Deploy the application
flyctl deploy
```

### Environment Variables

**Development (.env)**:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tensillabs-lite
```

**Production (Fly.io)**:
- `NODE_ENV=production` (set in fly.toml)
- `MONGODB_URI` (set as secret)
- `PORT=3000` (default, can be overridden)

### Health Check Endpoints

- `GET /api/v1/health` - Overall application health
- `GET /api/v1/health/database` - Database-specific health check

### MongoDB Atlas Example

If using MongoDB Atlas:
```bash
flyctl secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/tensillabs-lite?retryWrites=true&w=majority"
```

### Local Development Commands

```bash
# Start MongoDB with Docker
npm run db:start

# Stop MongoDB
npm run db:stop

# View MongoDB logs
npm run db:logs

# Access MongoDB shell
npm run db:shell

# Start development server
npm run dev
```
