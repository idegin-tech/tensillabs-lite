export interface TimeEntry {
    id: string
    description: string
    projectId?: string
    projectName?: string
    taskId?: string
    taskName?: string
    startTime: string
    endTime?: string
    duration: string
    durationMinutes?: number
    date: string
    isRunning?: boolean
}

export interface Project {
    id: string
    name: string
    color?: string
}

export interface TimesheetStats {
    totalEntries: number
    totalHours: number
    todayHours: number
    thisWeekHours: number
}

export type DateFilter = 'all' | 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month'
