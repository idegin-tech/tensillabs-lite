import { ColumnDef } from "@tanstack/react-table"
import { TbPlus } from 'react-icons/tb'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
import TaskColumnRenderer from '../../../../../components/TaskColumnRenderer'

interface CreateColumnsProps {
  onLocalUpdate?: (taskId: string, updates: Partial<Task>) => void
  onTaskClick?: (taskId: string) => void
}


export const createColumns = ({ onLocalUpdate, onTaskClick }: CreateColumnsProps = {}): ColumnDef<Task>[] => [{
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
    enableResizing: true,    cell: ({ row }) => {
        const task = row.original
        return (
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p 
                        className="font-medium truncate cursor-pointer hover:underline" 
                        onClick={() => onTaskClick?.(task._id)}
                    >
                        {task.name}
                    </p>
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
    enableResizing: true,    cell: ({ row }) => {
        const status = row.getValue("status") as TaskStatus
        return (
            <TaskColumnRenderer
                accessorKey="status"
                value={status}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
            />
        )
    },
},
{
    accessorKey: "priority",
    header: "Priority",
    minSize: 150,
    maxSize: 400,
    enableResizing: true,    cell: ({ row }) => {
        const priority = row.getValue("priority") as TaskPriority
        return (
            <TaskColumnRenderer
                accessorKey="priority"
                value={priority}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
            />
        )
    },
},
{
    accessorKey: "timeframe",
    header: "Timeframe",
    minSize: 200,
    maxSize: 400,
    enableResizing: true,    cell: ({ row }) => {
        const timeframe = row.getValue("timeframe") as Task['timeframe']
        return (
            <TaskColumnRenderer
                accessorKey="timeframe"
                value={timeframe}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
            />
        )
    },
},
{
    accessorKey: "assignee",
    header: "Assignee",
    minSize: 200,
    maxSize: 480,
    enableResizing: true,    cell: ({ row }) => {
        const assignee = row.original.assignee
        return (
            <TaskColumnRenderer
                accessorKey="assignee"
                value={assignee}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
            />
        )
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
