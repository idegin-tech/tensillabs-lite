import { ColumnDef } from "@tanstack/react-table"
import { TbPlus, TbListCheck, TbCircleCheck, TbFlag, TbCalendar, TbUser, TbProgress, TbClock, TbTag, TbLock, TbBlockquote, TbAlertTriangle } from 'react-icons/tb'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
import TaskColumnRenderer from '../../../../../components/TaskColumnRenderer'
import TaskProgressProperty from '../../../../../components/TaskProperties/TaskProgressProperty'

interface CreateColumnsProps {
  onLocalUpdate?: (taskId: string, updates: Partial<Task>) => void
  onTaskClick?: (taskId: string) => void
  allTasks?: Task[]
}


export const createColumns = ({ onLocalUpdate, onTaskClick, allTasks = [] }: CreateColumnsProps = {}): ColumnDef<Task>[] => [{
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
    header: () => (
        <div className="flex items-center gap-2">
            <TbListCheck className="h-4 w-4" />
            <span>Name</span>
        </div>
    ),
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
    header: () => (
        <div className="flex items-center gap-2">
            <TbCircleCheck className="h-4 w-4" />
            <span>Status</span>
        </div>
    ),
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
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "priority",
    header: () => (
        <div className="flex items-center gap-2">
            <TbFlag className="h-4 w-4" />
            <span>Priority</span>
        </div>
    ),
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
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "timeframe",
    header: () => (
        <div className="flex items-center gap-2">
            <TbCalendar className="h-4 w-4" />
            <span>Timeframe</span>
        </div>
    ),
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
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "assignee",
    header: () => (
        <div className="flex items-center gap-2">
            <TbUser className="h-4 w-4" />
            <span>Assignee</span>
        </div>
    ),
    minSize: 200,
    maxSize: 480,
    enableResizing: true,    
    cell: ({ row }) => {
        const assignee = row.original.assignee
        return (
            <TaskColumnRenderer
                accessorKey="assignee"
                value={assignee}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "progress",
    header: () => (
        <div className="flex items-center gap-2">
            <TbProgress className="h-4 w-4" />
            <span>Progress</span>
        </div>
    ),
    minSize: 120,
    maxSize: 200,
    enableResizing: true,
    cell: ({ row }) => (
        <TaskProgressProperty value={row.original.progress} />
    ),
},
{
    accessorKey: "estimatedHours",
    header: () => (
        <div className="flex items-center gap-2">
            <TbClock className="h-4 w-4" />
            <span>Est. Hours</span>
        </div>
    ),
    minSize: 100,
    maxSize: 150,
    enableResizing: true,
    cell: ({ row }) => {
        const estimatedHours = row.getValue("estimatedHours") as number | undefined
        return (
            <TaskColumnRenderer
                accessorKey="estimatedHours"
                value={estimatedHours}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "tags",
    header: () => (
        <div className="flex items-center gap-2">
            <TbTag className="h-4 w-4" />
            <span>Tags</span>
        </div>
    ),
    minSize: 150,
    maxSize: 300,
    enableResizing: true,
    cell: ({ row }) => {
        const tags = row.getValue("tags") as string[] | undefined
        return (
            <TaskColumnRenderer
                accessorKey="tags"
                value={tags}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "blockers",
    header: () => (
        <div className="flex items-center gap-2">
            <TbAlertTriangle className="h-4 w-4" />
            <span>Blockers</span>
        </div>
    ),
    minSize: 120,
    maxSize: 150,
    enableResizing: true,
    cell: ({ row }) => {
        return (
            <TaskColumnRenderer
                accessorKey="blocked"
                value={row.original.blockedReason}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
                allTasks={allTasks}
            />
        )
    },
},
{
    accessorKey: "blockedByTaskIds",
    header: () => (
        <div className="flex items-center gap-2">
            <TbBlockquote className="h-4 w-4" />
            <span>Blocking</span>
        </div>
    ),
    minSize: 120,
    maxSize: 200,
    enableResizing: true,
    cell: ({ row }) => {
        return (
            <TaskColumnRenderer
                accessorKey="blockingTasks"
                value={row.original.blockedByTaskIds}
                task={row.original}
                onLocalUpdate={onLocalUpdate}
                allTasks={allTasks}
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
