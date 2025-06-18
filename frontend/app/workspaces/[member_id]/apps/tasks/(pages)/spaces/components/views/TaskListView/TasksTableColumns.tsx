import { ColumnDef } from "@tanstack/react-table"
import { TbUser, TbPlus } from 'react-icons/tb'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
import { TaskStatusProperty, TaskPriorityProperty, TaskTimeframeProperty } from "../../../../../components/TaskProperties"


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
    maxSize: 40,
    enableResizing: false,
},
{
    accessorKey: "name",
    header: "Name",
    minSize: 400,
    maxSize: 500,
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
},
{
    accessorKey: "status",
    header: "Status",
    minSize: 150,
    maxSize: 400,
    enableResizing: true,
    cell: ({ row }) => {
        const status = row.getValue("status") as TaskStatus
        return (
            <TaskStatusProperty
                value={status}
            />
        )
    },
},
{
    accessorKey: "priority",
    header: "Priority",
    minSize: 150,
    maxSize: 400,
    enableResizing: true, cell: ({ row }) => {
        const priority = row.getValue("priority") as TaskPriority
        return (
            <TaskPriorityProperty
                value={priority}
            />
        )
    },
},
{
    accessorKey: "timeframe",
    header: "Timeframe",
    minSize: 200,
    maxSize: 400,
    enableResizing: true, cell: ({ row }) => {
        const timeframe = row.getValue("timeframe") as Task['timeframe']
        return (
            <TaskTimeframeProperty
                value={timeframe}
            />
        )
    },
},
{
    accessorKey: "assignee",
    header: "Assignee",
    minSize: 200,
    maxSize: 480,
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
            </div>)
    },
},
{
    id: "actions",
    header: () => (
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <TbPlus className="h-4 w-4" />
        </Button>
    ),
    cell: () => (
        <div className="w-full"></div>
    ),
    minSize: 400,
    maxSize: 500,
    enableResizing: true,
    enableSorting: false,
    enableHiding: false,
},
]
