import { SeedData } from '../seed.interface';

export const productionSeedData: SeedData = {
    users: [
        {
            email: 'admin@company.com',
            password: 'ChangeMe@123!',
            timezone: 'Africa/Lagos',
            isEmailVerified: true,
        },
    ],

    workspaces: [
        {
            name: 'My Workspace',
            description: 'Default workspace',
            slug: 'my-workspace',
            createdByEmail: 'admin@company.com',
        },
    ],

    workspaceMembers: [
        {
            userEmail: 'admin@company.com',
            workspaceSlug: 'my-workspace',
            firstName: 'Admin',
            lastName: 'User',
            primaryEmail: 'admin@company.com',
            status: 'active',
        },
    ],

    roles: [
        {
            name: 'Employee',
            description: 'Default employee role',
            workspaceSlug: 'my-workspace',
            createdByEmail: 'admin@company.com',
            isActive: true,
        },
    ],

    teams: [
        {
            name: 'General',
            description: 'General team',
            workspaceSlug: 'my-workspace',
            createdByEmail: 'admin@company.com',
            isActive: true,
        },
    ],

    offices: [
        {
            name: 'Main Office',
            description: 'Primary office location',
            workspaceSlug: 'my-workspace',
            createdByEmail: 'admin@company.com',
            isActive: true,
        },
    ],

    clients: [],
};
