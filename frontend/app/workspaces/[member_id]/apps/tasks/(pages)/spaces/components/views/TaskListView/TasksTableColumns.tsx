import { ColumnDef } from "@tanstack/react-table"
import { TbCircle, TbCircleCheck, TbClock, TbAlertTriangle, TbUser, TbCalendar, TbFileText, TbCalendarEvent } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'

const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.COMPLETED:
            return <TbCircleCheck className="h-4 w-4 text-green-600" />
        case TaskStatus.IN_PROGRESS:
            return <TbClock className="h-4 w-4 text-blue-600" />
        case TaskStatus.IN_REVIEW:
            return <TbAlertTriangle className="h-4 w-4 text-orange-600" />
        default:
            return <TbCircle className="h-4 w-4 text-gray-400" />
    }
}

const getPriorityBadge = (priority?: TaskPriority) => {
    if (!priority) return null
    
    const variants = {
        urgent: 'destructive',
        high: 'destructive',
        normal: 'secondary',
        low: 'outline'
    } as const

    const colors = {
        urgent: 'bg-red-100 text-red-800 border-red-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        normal: 'bg-blue-100 text-blue-800 border-blue-200',
        low: 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
        <Badge variant={variants[priority] || 'outline'} className={cn('text-xs', colors[priority])}>
            {priority}
        </Badge>
    )
}

const formatTimeframe = (timeframe?: Task['timeframe']) => {
    if (!timeframe || (!timeframe.start && !timeframe.end)) return 'No dates'
    if (!timeframe.start) return `Due: ${new Date(timeframe.end!).toLocaleDateString()}`
    if (!timeframe.end) return `Started: ${new Date(timeframe.start).toLocaleDateString()}`
    return `${new Date(timeframe.start).toLocaleDateString()} - ${new Date(timeframe.end).toLocaleDateString()}`
}

export const createColumns = (): ColumnDef<Task>[] => [{
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableResizing: false,
},
{
    accessorKey: "name",
    header: "Name",
    size: 250,
    minSize: 200,
    maxSize: 400,
    enablePinning: true,
    enableResizing: true,
    cell: ({ row }) => {
        const task = row.original
        return (
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{task.name}</p>
                </div>
            </div>
        )
    },
}, {
    accessorKey: "status",
    header: "Status",
    size: 120,
    minSize: 100,
    maxSize: 150,
    enableResizing: true,    
    cell: ({ row }) => {
        const status = row.getValue("status") as TaskStatus
        return (
            <div className="flex items-center gap-2">
                {getStatusIcon(status)}
                <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
            </div>
        )
    },
},
{
    accessorKey: "priority",
    header: "Priority",
    size: 100,
    minSize: 80,
    maxSize: 120,
    enableResizing: true,
    cell: ({ row }) => {
        const priority = row.getValue("priority") as TaskPriority
        return getPriorityBadge(priority)
    },
},
{
    accessorKey: "timeframe",
    header: "Timeframe",
    size: 180,
    minSize: 150,
    maxSize: 220,
    enableResizing: true,
    cell: ({ row }) => {
        const timeframe = row.getValue("timeframe") as Task['timeframe']
        return (
            <div className="flex items-center gap-2">
                <TbCalendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">35 July 2023</span>
            </div>
        )
    },
}, {
    accessorKey: "createdBy",
    header: "Created By",
    size: 150,
    minSize: 120,
    maxSize: 180,
    enableResizing: true,
    cell: ({ row }) => {
        const createdBy = row.original.createdBy
        return (
            <div className="flex items-center gap-2">
                <TbUser className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{`${createdBy.firstName} ${createdBy.lastName}`}</span>
            </div>
        )
    },
},
{
    accessorKey: "description",
    header: "Description",
    size: 250,
    minSize: 200,
    maxSize: 350,
    enableResizing: true,
    cell: ({ row }) => {
        const description = row.getValue("description") as string
        return description ? (
            <div className="flex items-center gap-2">
                <TbFileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]" title={description}>
                    {description}
                </span>
            </div>
        ) : (
            <span className="text-sm text-muted-foreground">No description</span>
        )
    },
},
{
    accessorKey: "assignee",
    header: "Assignee",
    size: 150,
    minSize: 120,
    maxSize: 180,
    enableResizing: true,
    cell: ({ row }) => {
        const assignee = row.original.assignee
        if (assignee.length === 0) {
            return <span className="text-sm text-muted-foreground">Unassigned</span>
        }
        const firstAssignee = assignee[0]
        return (
            <div className="flex items-center gap-2">
                <TbUser className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{`${firstAssignee.firstName} ${firstAssignee.lastName}`}</span>
                {assignee.length > 1 && (
                    <span className="text-xs text-muted-foreground">+{assignee.length - 1}</span>
                )}
            </div>
        )
    },
},
{
    accessorKey: "updatedAt",
    header: "Last Updated",
    size: 140,
    minSize: 120,
    maxSize: 170,
    cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string
        return (
            <div className="flex items-center gap-2">
                <TbCalendarEvent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Updated It</span>
            </div>
        )
    },
},
]
