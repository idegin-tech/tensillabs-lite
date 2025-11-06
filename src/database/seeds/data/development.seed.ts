import { SeedData } from '../seed.interface';
import { getSpacesSeedData } from './spaces.seed';

export async function getDevelopmentSeedData(): Promise<SeedData> {
    const spacesSeedData = await getSpacesSeedData();
    
    return {
    users: [
        {
            email: 'admin@tensillabs.com',
            password: 'Admin@123',
            timezone: 'Africa/Lagos',
            isEmailVerified: true,
        },
        {
            email: 'john.doe@tensillabs.com',
            password: 'User@123',
            timezone: 'America/New_York',
            isEmailVerified: true,
        },
        {
            email: 'jane.smith@tensillabs.com',
            password: 'User@123',
            timezone: 'Europe/London',
            isEmailVerified: true,
        },
        {
            email: 'bob.wilson@tensillabs.com',
            password: 'User@123',
            timezone: 'Asia/Tokyo',
            isEmailVerified: true,
        },
    ],

    workspaces: [
        {
            name: 'Hawksworth Inc.',
            description: 'Best management consulting firm in Nigeria',
            slug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
        },
        {
            name: 'Development Team',
            description: 'Workspace for development projects and sprint planning',
            slug: 'dev-team',
            createdByEmail: 'john.doe@tensillabs.com',
        },
    ],

    workspaceMembers: [
        {
            userEmail: 'admin@tensillabs.com',
            workspaceSlug: 'hawksworth-inc',
            firstName: 'Admin',
            lastName: 'User',
            primaryEmail: 'admin@tensillabs.com',
            permission: 'super_admin',
            bio: 'System administrator and workspace owner',
            workPhone: '+234-123-456-7890',
            mobilePhone: '+234-987-654-3210',
            status: 'active',
        },
        {
            userEmail: 'john.doe@tensillabs.com',
            workspaceSlug: 'hawksworth-inc',
            firstName: 'John',
            middleName: 'Michael',
            lastName: 'Doe',
            primaryEmail: 'john.doe@tensillabs.com',
            secondaryEmail: 'j.doe@example.com',
            permission: 'admin',
            bio: 'Senior Software Engineer and Team Lead',
            workPhone: '+1-555-123-4567',
            mobilePhone: '+1-555-987-6543',
            status: 'active',
        },
        {
            userEmail: 'jane.smith@tensillabs.com',
            workspaceSlug: 'hawksworth-inc',
            firstName: 'Jane',
            lastName: 'Smith',
            primaryEmail: 'jane.smith@tensillabs.com',
            permission: 'manager',
            bio: 'Project Manager and Product Owner',
            workPhone: '+44-20-7123-4567',
            status: 'active',
        },
        {
            userEmail: 'bob.wilson@tensillabs.com',
            workspaceSlug: 'hawksworth-inc',
            firstName: 'Bob',
            lastName: 'Wilson',
            primaryEmail: 'bob.wilson@tensillabs.com',
            permission: 'regular',
            bio: 'Frontend Developer',
            workPhone: '+81-3-1234-5678',
            status: 'active',
        },
        {
            userEmail: 'john.doe@tensillabs.com',
            workspaceSlug: 'dev-team',
            firstName: 'John',
            middleName: 'Michael',
            lastName: 'Doe',
            primaryEmail: 'john.doe@tensillabs.com',
            permission: 'super_admin',
            bio: 'Dev Team Lead',
            status: 'active',
        },
        {
            userEmail: 'bob.wilson@tensillabs.com',
            workspaceSlug: 'dev-team',
            firstName: 'Bob',
            lastName: 'Wilson',
            primaryEmail: 'bob.wilson@tensillabs.com',
            permission: 'admin',
            bio: 'Senior Developer',
            status: 'active',
        },
    ],

    roles: [
        {
            name: 'Software Engineer',
            description: 'Develops and maintains software applications',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Senior Software Engineer',
            description: 'Senior developer with leadership responsibilities',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Project Manager',
            description: 'Manages projects and coordinates teams',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Product Designer',
            description: 'Designs user interfaces and user experiences',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'QA Engineer',
            description: 'Tests and ensures software quality',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Full Stack Developer',
            description: 'Works on both frontend and backend',
            workspaceSlug: 'dev-team',
            createdByEmail: 'john.doe@tensillabs.com',
            isActive: true,
        },
    ],

    teams: [
        {
            name: 'Engineering',
            description: 'Software development and engineering team',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Product',
            description: 'Product management and design team',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Quality Assurance',
            description: 'Testing and quality assurance team',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Frontend Team',
            description: 'Frontend development specialists',
            workspaceSlug: 'dev-team',
            createdByEmail: 'john.doe@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Backend Team',
            description: 'Backend development specialists',
            workspaceSlug: 'dev-team',
            createdByEmail: 'john.doe@tensillabs.com',
            isActive: true,
        },
    ],

    offices: [
        {
            name: 'Lagos Office',
            description: 'Main office in Lagos, Nigeria',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'New York Office',
            description: 'US headquarters in New York',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'London Office',
            description: 'European office in London',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Remote',
            description: 'Remote workers worldwide',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
    ],

    clients: [
        {
            name: 'Acme Corporation',
            description: 'Enterprise software solutions client',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'TechStart Inc',
            description: 'Startup technology company',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'Global Finance Group',
            description: 'Financial services corporation',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
        {
            name: 'HealthCare Plus',
            description: 'Healthcare technology provider',
            workspaceSlug: 'hawksworth-inc',
            createdByEmail: 'admin@tensillabs.com',
            isActive: true,
        },
    ],

    spaces: spacesSeedData.spaces,
    lists: spacesSeedData.lists,
    spaceParticipants: spacesSeedData.spaceParticipants,
    tasks: spacesSeedData.tasks,
    };
}
