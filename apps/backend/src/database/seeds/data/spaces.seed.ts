
export interface SpaceSeedData {
  name: string;
  description?: string;
  color: string;
  icon: string;
  workspaceSlug: string;
  createdByEmail: string;
  isPublic?: boolean;
}

export interface ListSeedData {
  name: string;
  description?: string;
  spaceName: string;
  workspaceSlug: string;
  isPrivate?: boolean;
}

export interface SpaceParticipantSeedData {
  spaceName: string;
  workspaceSlug: string;
  memberEmail: string;
  permissions: 'admin' | 'regular';
  status?: 'active' | 'inactive';
}

export interface TaskSeedData {
  name: string;
  description?: string;
  listName: string;
  spaceName: string;
  workspaceSlug: string;
  createdByEmail: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  status?: 'todo' | 'in_progress' | 'in_review' | 'canceled' | 'completed';
  timeframe?: {
    start?: string;
    end?: string;
  };
  assigneeEmails?: string[];
  estimatedHours?: number;
  progress?: number;
  tags?: string[];
  completedAt?: string;
  startedAt?: string;
}

export interface SpacesSeedData {
  spaces: SpaceSeedData[];
  lists: ListSeedData[];
  spaceParticipants: SpaceParticipantSeedData[];
  tasks: TaskSeedData[];
}

const statuses: Array<'todo' | 'in_progress' | 'in_review' | 'canceled' | 'completed'> = [
  'todo',
  'in_progress',
  'in_review',
  'canceled',
  'completed',
];

const priorities: Array<'urgent' | 'high' | 'normal' | 'low'> = [
  'urgent',
  'high',
  'normal',
  'low',
];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDateRange = (): { start: string; end: string } => {
  const now = new Date();
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const twoMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 2, 28);
  
  const start = new Date(twoMonthsAgo.getTime() + Math.random() * (now.getTime() - twoMonthsAgo.getTime()));
  const end = new Date(start.getTime() + Math.random() * (twoMonthsFromNow.getTime() - start.getTime()));
  
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const getRandomAssignees = (): string[] => {
  const allMembers = [
    'admin@tensillabs.com',
    'john.doe@tensillabs.com',
    'jane.smith@tensillabs.com',
    'bob.wilson@tensillabs.com',
  ];
  
  const randomChance = Math.random();
  
  if (randomChance < 0.15) {
    return [];
  }
  
  if (randomChance < 0.5) {
    return [getRandomElement(allMembers)];
  }
  
  if (randomChance < 0.8) {
    const first = getRandomElement(allMembers);
    let second = getRandomElement(allMembers);
    while (second === first) {
      second = getRandomElement(allMembers);
    }
    return [first, second];
  }
  
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...allMembers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allMembers.length));
};

const getRandomEstimatedHours = (): number | undefined => {
  if (Math.random() < 0.3) return undefined;
  return Math.floor(Math.random() * 40) + 1;
};

const getRandomProgress = (status: string): number => {
  switch (status) {
    case 'todo':
      return 0;
    case 'in_progress':
      return Math.floor(Math.random() * 70) + 10;
    case 'in_review':
      return Math.floor(Math.random() * 20) + 75;
    case 'completed':
      return 100;
    case 'canceled':
      return Math.floor(Math.random() * 50);
    default:
      return 0;
  }
};

const getTags = (): string[] | undefined => {
  if (Math.random() < 0.4) return undefined;
  
  const allTags = ['frontend', 'backend', 'api', 'database', 'ui/ux', 'bug', 'feature', 'enhancement', 'testing', 'documentation'];
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...allTags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

async function generateTasksFromAPI(): Promise<TaskSeedData[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=200');
    const todos = await response.json();

    return todos.map((todo: any, index: number) => {
      const hasDescription = Math.random() > 0.3;
      const status = getRandomElement(statuses);
      const timeframe = Math.random() > 0.2 ? getRandomDateRange() : undefined;
      const estimatedHours = getRandomEstimatedHours();
      const progress = getRandomProgress(status);
      const tags = getTags();
      const assigneeEmails = getRandomAssignees();
      
      const taskData: any = {
        name: todo.title,
        description: hasDescription
          ? `Task ${index + 1}: ${todo.title}. This involves coordinating with team members, reviewing specifications, implementing features, and ensuring quality standards are met throughout the development process.`
          : undefined,
        listName: 'Sprint Tasks',
        spaceName: 'Product Development',
        workspaceSlug: 'hawksworth-inc',
        createdByEmail: 'admin@tensillabs.com',
        priority: getRandomElement(priorities),
        status,
        timeframe,
        assigneeEmails,
        estimatedHours,
        progress,
        tags,
      };
      
      if (status === 'completed') {
        taskData.completedAt = timeframe.end || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      if (status === 'in_progress' && Math.random() > 0.7) {
        taskData.startedAt = timeframe?.start || new Date().toISOString();
      }
      
      return taskData;
    });
  } catch (error) {
    console.error('Failed to fetch tasks from API, using fallback data:', error);
    return generateFallbackTasks();
  }
}

function generateFallbackTasks(): TaskSeedData[] {
  const taskTemplates = [
    'Implement user authentication system',
    'Design database schema',
    'Create RESTful API endpoints',
    'Build responsive dashboard',
    'Implement real-time notifications',
    'Set up CI/CD pipeline',
    'Write unit tests',
    'Optimize database queries',
    'Create user profile page',
    'Implement file upload functionality',
  ];

  return Array.from({ length: 100 }, (_, index) => {
    const template = taskTemplates[index % taskTemplates.length];
    const status = getRandomElement(statuses);
    const timeframe = Math.random() > 0.2 ? getRandomDateRange() : undefined;
    const estimatedHours = getRandomEstimatedHours();
    const progress = getRandomProgress(status);
    const tags = getTags();
    const assigneeEmails = getRandomAssignees();
    
    const taskData: any = {
      name: `${template} ${Math.floor(index / taskTemplates.length) + 1}`,
      description: `Task ${index + 1}: Implementation of ${template.toLowerCase()}. This requires careful planning, execution, and testing to ensure quality deliverables.`,
      listName: 'Sprint Tasks',
      spaceName: 'Product Development',
      workspaceSlug: 'hawksworth-inc',
      createdByEmail: 'admin@tensillabs.com',
      priority: getRandomElement(priorities),
      status,
      timeframe,
      assigneeEmails,
      estimatedHours,
      progress,
      tags,
    };
    
    if (status === 'completed' && timeframe?.end) {
      taskData.completedAt = timeframe.end;
    }
    
    if (status === 'in_progress' && Math.random() > 0.7) {
      taskData.startedAt = timeframe?.start || new Date().toISOString();
    }
    
    return taskData;
  });
}

export async function getSpacesSeedData(): Promise<SpacesSeedData> {
  const tasks = await generateTasksFromAPI();

  return {
    spaces: [
      {
        name: 'Product Development',
        description: 'Main space for product development and engineering tasks',
        color: '#3B82F6',
        icon: 'fa-rocket',
        workspaceSlug: 'hawksworth-inc',
        createdByEmail: 'admin@tensillabs.com',
        isPublic: false,
      },
    ],

    lists: [
      {
        name: 'Sprint Tasks',
        description: 'Current sprint backlog and active development tasks',
        spaceName: 'Product Development',
        workspaceSlug: 'hawksworth-inc',
        isPrivate: false,
      },
    ],

    spaceParticipants: [
      {
        spaceName: 'Product Development',
        workspaceSlug: 'hawksworth-inc',
        memberEmail: 'admin@tensillabs.com',
        permissions: 'admin',
        status: 'active',
      },
    ],

    tasks,
  };
}

