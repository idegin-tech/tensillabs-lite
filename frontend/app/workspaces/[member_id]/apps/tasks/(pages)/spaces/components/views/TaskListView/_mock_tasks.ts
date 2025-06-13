import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'

export const mockTasks: Task[] = [{
    _id: '1',
    task_id: 'TASK-001',
    name: 'Design system components',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    timeframe: {
        start: '2024-01-15',
        end: '2024-02-15'
    },
    assignee: [{
        _id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        primaryEmail: 'john.doe@example.com'
    }],
    createdBy: {
        _id: 'user-pm',
        firstName: 'Product',
        lastName: 'Manager',
        primaryEmail: 'pm@example.com'
    },
    description: 'Create reusable design system components for the application',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
}, {
    _id: '2',
    task_id: 'TASK-002',
    name: 'API integration testing',
    status: TaskStatus.IN_REVIEW,
    priority: TaskPriority.NORMAL,
    timeframe: {
        start: '2024-01-10',
        end: '2024-01-25'
    },
    assignee: [{
        _id: 'user-2',
        firstName: 'Jane',
        lastName: 'Smith',
        primaryEmail: 'jane.smith@example.com'
    }],
    createdBy: {
        _id: 'user-tl',
        firstName: 'Tech',
        lastName: 'Lead',
        primaryEmail: 'techlead@example.com'
    },
    description: 'Comprehensive testing of all API endpoints and integration points',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
}, {
    _id: '3',
    task_id: 'TASK-003',
    name: 'User documentation',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    timeframe: {
        end: '2024-02-28'
    },
    assignee: [{
        _id: 'user-3',
        firstName: 'Mike',
        lastName: 'Johnson',
        primaryEmail: 'mike.johnson@example.com'
    }],
    createdBy: {
        _id: 'user-pm',
        firstName: 'Product',
        lastName: 'Manager',
        primaryEmail: 'pm@example.com'
    },
    description: 'Create detailed user documentation and help guides',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
}, {
    _id: '4',
    task_id: 'TASK-004',
    name: 'Database optimization',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.URGENT,
    timeframe: {
        start: '2024-01-01',
        end: '2024-01-14'
    },
    assignee: [{
        _id: 'user-4',
        firstName: 'Sarah',
        lastName: 'Wilson',
        primaryEmail: 'sarah.wilson@example.com'
    }],
    createdBy: {
        _id: 'user-dba',
        firstName: 'Database',
        lastName: 'Admin',
        primaryEmail: 'dba@example.com'
    },
    description: 'Optimize database queries and improve overall performance',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
}, {
    _id: '5',
    task_id: 'TASK-005',
    name: 'Mobile responsiveness fixes',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    timeframe: {
        start: '2024-01-20',
        end: '2024-02-05'
    },
    assignee: [{
        _id: 'user-5',
        firstName: 'Alex',
        lastName: 'Chen',
        primaryEmail: 'alex.chen@example.com'
    }],
    createdBy: {
        _id: 'user-designer',
        firstName: 'UI/UX',
        lastName: 'Designer',
        primaryEmail: 'designer@example.com'
    },
    description: 'Fix responsive design issues across mobile devices',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-19T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
}, {
    _id: '6',
    task_id: 'TASK-006',
    name: 'Performance monitoring setup',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.NORMAL,
    timeframe: {
        start: '2024-01-12',
        end: '2024-01-30'
    },
    assignee: [{
        _id: 'user-6',
        firstName: 'Emma',
        lastName: 'Taylor',
        primaryEmail: 'emma.taylor@example.com'
    }],
    createdBy: {
        _id: 'user-devops',
        firstName: 'DevOps',
        lastName: 'Lead',
        primaryEmail: 'devops@example.com'
    },
    description: 'Implement comprehensive performance monitoring and alerting',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z'
}, {
    _id: '7',
    task_id: 'TASK-007',
    name: 'Security audit',
    status: TaskStatus.IN_REVIEW,
    priority: TaskPriority.URGENT,
    timeframe: {
        start: '2024-01-05',
        end: '2024-01-20'
    },
    assignee: [{
        _id: 'user-7',
        firstName: 'David',
        lastName: 'Lee',
        primaryEmail: 'david.lee@example.com'
    }],
    createdBy: {
        _id: 'user-security',
        firstName: 'Security',
        lastName: 'Officer',
        primaryEmail: 'security@example.com'
    },
    description: 'Comprehensive security audit and vulnerability assessment',
    workspace: 'workspace-1',
    space: 'space-1',
    list: 'list-1',
    isDeleted: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
}]
