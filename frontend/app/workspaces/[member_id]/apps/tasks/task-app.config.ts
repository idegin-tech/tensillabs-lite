import { TaskGrouping } from "@/types/tasks.types";
import { TbCircle, TbClock, TbAlertTriangle, TbCircleCheck, TbX, TbExclamationCircle, TbArrowUp, TbMinus, TbArrowDown, TbCalendarX, TbCalendarEvent, TbCalendar, TbClock2, TbDots } from 'react-icons/tb';

export const getDefaultExpandedGroup = (groupBy: string): string | null => {
    const groupConfig = taskGroupConfig[groupBy]
    if (!groupConfig) return null
    
    const defaultGroup = groupConfig.find(group => group.defaultOpen)
    if (!defaultGroup) return null
    
    return `${defaultGroup.groupKey}-${defaultGroup.label}`
}

export const taskGroupConfig: Record<string, TaskGrouping[]> = {
    "status": [
        {
            label: 'To Do',
            groupKey: 'status',
            icon: TbCircle,
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
            query: { status: "todo" }
        },
        {
            label: 'In Progress',
            groupKey: 'status',
            icon: TbClock,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            query: { status: "in_progress" },
            defaultOpen: true
        },
        {
            label: 'In Review',
            groupKey: 'status',
            icon: TbAlertTriangle,
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
            query: { status: "in_review" }
        },
        {
            label: 'Completed',
            groupKey: 'status',
            icon: TbCircleCheck,
            color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            query: { status: "completed" }
        },
        {
            label: 'Canceled',
            groupKey: 'status',
            icon: TbX,
            color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            query: { status: "canceled" }
        }
    ],
    "priority": [
        {
            label: 'Urgent',
            groupKey: 'priority',
            icon: TbExclamationCircle,
            color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            query: { priority: "urgent" },
            defaultOpen: true
        },
        {
            label: 'High',
            groupKey: 'priority',
            icon: TbArrowUp,
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
            query: { priority: "high" }
        },
        {
            label: 'Normal',
            groupKey: 'priority',
            icon: TbMinus,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            query: { priority: "normal" }
        },
        {
            label: 'Low',
            groupKey: 'priority',
            icon: TbArrowDown,
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
            query: { priority: "low" }
        },
        {
            label: 'No Priority',
            groupKey: 'priority',
            icon: TbMinus,
            color: 'bg-gray-50 text-gray-500 dark:bg-gray-900/20 dark:text-gray-500',
            query: { priority: "none" }
        }
    ],
    "due_date": [
        {
            label: 'Overdue',
            groupKey: 'due_date',
            icon: TbCalendarX,
            color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            query: { due_status: "overdue" }
        },
        {
            label: 'Due Today',
            groupKey: 'due_date',
            icon: TbCalendarEvent,
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
            query: { due_status: "today" },
            defaultOpen: true
        },
        {
            label: 'Due Tomorrow',
            groupKey: 'due_date',
            icon: TbCalendar,
            color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
            query: { due_status: "tomorrow" }
        },
        {
            label: 'Due This Week',
            groupKey: 'due_date',
            icon: TbClock2,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            query: { due_status: "this_week" }
        },
        {
            label: 'Due Later',
            groupKey: 'due_date',
            icon: TbClock,
            color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            query: { due_status: "later" }
        },
        {
            label: 'No Due Date',
            groupKey: 'due_date',
            icon: TbDots,
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
            query: { due_status: "none" }
        }
    ]
}
