import React from 'react'
import EachTaskDetailsProperty from '../EachTaskDetailsProperty'
import { TaskPriorityProperty, TaskStatusProperty, TaskTimeframeProperty, TaskAssigneeProperty } from '../../TaskProperties'
import { TaskPriority, TaskStatus, Task } from '@/types/tasks.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { TbCircleCheck, TbPaperclip } from 'react-icons/tb'
import TaskDescription from './TaskDescription'
import TaskActionItems from './TaskActionItems'
import TaskDetailsAttachments from './TaskDetailsAttachments'
import { useUpdateTask } from '../../../hooks/use-tasks'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useCommon from '@/hooks/use-common'
import { useTaskList } from '../../../contexts/task-list.context'
import { invalidateTaskGroups } from '../../../utils/cache-invalidation'

interface ChecklistItem {
    _id: string
    name: string
    isDone: boolean
    task: string
    workspace: string
    space?: string
    list?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

interface TaskDetailsProps {
    task?: Task
    checklist?: ChecklistItem[]
}

export default function TaskDetails({ task, checklist }: TaskDetailsProps) {
    const params = useParams()
    const listId = params.list_id as string
    const { member_id } = useCommon()
    const updateTaskMutation = useUpdateTask(listId)
    const queryClient = useQueryClient()
    const { state } = useTaskList()

    const [taskName, setTaskName] = React.useState(task?.name || '')
    const taskStatus = task?.status;
    const taskPriority = task?.priority;
    const taskTimeframe = task?.timeframe;
    const taskAssignees = task?.assignee || []
    const taskDescription = task?.description

    React.useEffect(() => {
        setTaskName(task?.name || '')
    }, [task?.name])

    const handleTaskUpdate = async (field: string, value: any) => {
        if (!task?._id) return

        const previousTask = { ...task }

        try {
            const updateData: Record<string, any> = { [field]: value }
            
            if (field === 'assignee' && Array.isArray(value)) {
                updateData.assignee = value.map((assignee: any) => assignee._id)
            }

            const response = await updateTaskMutation.mutateAsync({
                taskId: task._id,
                data: updateData
            })

            if (response.success) {
                const updatedTask = response.payload

                queryClient.setQueryData(['task-details', listId, task._id, member_id], 
                    (oldData: any) => oldData ? { ...oldData, payload: { ...oldData.payload, task: updatedTask } } : oldData
                )

                if (field === 'status' || field === 'priority' || field === 'timeframe') {
                    invalidateTaskGroups({
                        listId,
                        groupBy: state.groupBy,
                        task: updatedTask,
                        previousTask,
                        queryClient
                    })
                }
            }

        } catch (error: any) {
            toast.error('Failed to update task', {
                description: error.message || 'An unexpected error occurred'
            })
        }
    }

    return (
        <div className="h-full">
            <div className='space-y-10 p-4'>
                <div className='space-y-6'>
                        <Textarea
                            value={taskName}
                            placeholder="Task name"
                            autosize
                            minRows={1}
                            maxRows={3}
                            onChange={(e) => setTaskName(e.target.value)}
                            debounceMs={400}
                            onDebouncedChange={(value) => handleTaskUpdate('name', value)}
                            className="p-2 text-3xl font-bold leading-tight bg-transparent bg-none hover:bg-input border-0 shadow-none focus-visible:ring-0 resize-none focus:bg-input"
                        />

                    <div className='grid grid-cols-1 gap-y-6 gap-x-4'>
                        <EachTaskDetailsProperty
                            label='Status'
                        >
                            <TaskStatusProperty 
                                value={taskStatus} 
                                onChange={(value) => handleTaskUpdate('status', value)}
                            />
                        </EachTaskDetailsProperty>
                        <EachTaskDetailsProperty
                            label='Priority'
                        >
                            <TaskPriorityProperty 
                                value={taskPriority} 
                                onChange={(value) => handleTaskUpdate('priority', value)}
                            />
                        </EachTaskDetailsProperty>
                        <EachTaskDetailsProperty
                            label='Timeframe'
                        >
                            <TaskTimeframeProperty 
                                value={taskTimeframe} 
                                onChange={(value) => handleTaskUpdate('timeframe', value)}
                            />
                        </EachTaskDetailsProperty>
                        <EachTaskDetailsProperty
                            label='Assignees'
                        >
                            <TaskAssigneeProperty 
                                value={taskAssignees} 
                                onChange={(value) => handleTaskUpdate('assignee', value)}
                            />
                        </EachTaskDetailsProperty>
                    </div>
                </div>

                <TaskDescription 
                    description={taskDescription}
                    taskId={task?._id || ''}
                    onUpdate={(value) => handleTaskUpdate('description', value)}
                />

                <div className="space-y-4">
                    <Tabs defaultValue="checklist" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="checklist" className='h-10'>
                                <TbCircleCheck className="h-4 w-4 mr-2" />
                                Action Items
                            </TabsTrigger>
                            <TabsTrigger value="attachments" className='h-10'>
                                <TbPaperclip className="h-4 w-4 mr-2" />
                                Attachments
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="checklist" className="mt-4">
                            <TaskActionItems
                                taskId={task?._id}
                                checklist={checklist || []}
                            />
                        </TabsContent>
                        <TabsContent value="attachments" className="mt-4">
                            <TaskDetailsAttachments />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}