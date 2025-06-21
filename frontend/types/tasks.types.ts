export enum TaskPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export interface TaskTimeframe {
  start?: string
  end?: string
}

export interface TaskAssignee {
  _id: string
  firstName: string
  lastName: string
  primaryEmail: string
  avatarURL?: {
    sm: string
    original: string
  }
}

export interface Task {
  _id: string
  task_id: string
  name: string
  status: TaskStatus
  priority?: TaskPriority
  timeframe?: TaskTimeframe
  assignee: TaskAssignee[]
  createdBy: TaskAssignee
  description?: string
  workspace: string
  space: string
  list: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskGrouping {
  groupKey: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  defaultOpen?: boolean;
  query: Record<string, string>;
}

export interface TaskGroupProps {
  title?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  groupConfig?: TaskGrouping
}

export interface GroupedTasks {
  [key: string]: {
    count: number
    tasks: Task[]
  }
}

export interface TaskList {
  _id: string
  name: string
  description?: string
  isPrivate: boolean
  taskCount: number
  createdAt: string
  updatedAt: string
}
