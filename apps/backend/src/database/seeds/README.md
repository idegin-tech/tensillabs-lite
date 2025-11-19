# Database Seeding

This directory contains the database seeding system for TensilLabs Lite.

## Overview

The seeding system allows you to populate your database with initial data for both development and production environments.

## Structure

```
src/database/seeds/
├── seed.interface.ts       # TypeScript interfaces for seed data
├── seeder.service.ts       # Main seeding service
├── seeder.module.ts        # NestJS module for seeder
└── data/
    ├── development.seed.ts # Development seed data
    └── production.seed.ts  # Production seed data
```

## Usage

### Development Seeds

To seed your development database with comprehensive test data:

```bash
npm run seed:dev
```

Or simply:

```bash
npm run seed
```

This will create:
- 4 test users with verified accounts
- 2 workspaces (TensilLabs HQ and Development Team)
- 6 workspace members with different permission levels
- 6 roles (Software Engineer, Senior Engineer, PM, etc.)
- 5 teams (Engineering, Product, QA, etc.)
- 4 offices (Lagos, New York, London, Remote)
- 4 sample clients

### Production Seeds

To seed your production database with minimal initial data:

```bash
npm run seed:prod
```

This will create:
- 1 admin user
- 1 default workspace
- 1 workspace member (the admin)
- 1 default role
- 1 default team
- 1 default office

⚠️ **Warning**: The production seed creates an admin account with a default password. Make sure to change it immediately after first login!

## Development Seed Data

### Users
| Email | Password | Role |
|-------|----------|------|
| admin@tensillabs.com | Admin@123 | System Admin |
| john.doe@tensillabs.com | User@123 | Team Lead |
| jane.smith@tensillabs.com | User@123 | Project Manager |
| bob.wilson@tensillabs.com | User@123 | Developer |

### Workspaces
- **TensilLabs HQ**: Main workspace with all features
- **Development Team**: Secondary workspace for dev projects

## Production Seed Data

### Default Admin Account
- **Email**: admin@company.com
- **Password**: ChangeMe@123!
- **Permission**: super_admin

⚠️ **IMPORTANT**: Change this password immediately after deployment!

## Customizing Seed Data

### Development Seeds

Edit `src/database/seeds/data/development.seed.ts` to customize the development seed data.

### Production Seeds

Edit `src/database/seeds/data/production.seed.ts` to customize the production seed data.

## Important Notes

1. **Data Clearing**: Running seeds will **clear all existing data** from the database before seeding. This is intentional for development but use with extreme caution in production.

2. **Idempotency**: The seeder checks for existing records before creating new ones (after clearing), but it's still recommended to run seeds on a fresh database.

3. **Dependencies**: Seeds are run in order to respect foreign key constraints:
   - Users → Workspaces → WorkspaceMembers → Roles/Teams/Offices/Clients

4. **Password Hashing**: All passwords are properly hashed using bcrypt before being stored in the database.

5. **Environment**: The seeder automatically adapts to the environment (development/production) based on the command used.

## Troubleshooting

### Connection Issues
Make sure your database connection is configured correctly in your `.env` file:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tensillabs_lite
```

### Missing Dependencies
If you encounter import errors, make sure all dependencies are installed:

```bash
npm install
```

### Foreign Key Violations
The seeder respects foreign key constraints. If you encounter issues, check that:
- Parent records (users, workspaces) exist before child records
- Email references in seed data match exactly

## Adding New Seed Data

To add new entity types to the seeding system:

1. Add the interface to `seed.interface.ts`
2. Add the data to `development.seed.ts` and `production.seed.ts`
3. Add a private seed method to `seeder.service.ts`
4. Call the new method in the `seed()` method
5. Import the new repository in the service constructor

## Security Considerations

- Never commit real production credentials to version control
- Always change default passwords after seeding production
- Consider using environment variables for sensitive seed data
- Review seed data before running in any production-like environment
