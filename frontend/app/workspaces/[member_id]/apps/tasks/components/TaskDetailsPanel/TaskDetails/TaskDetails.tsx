import React from 'react'
import EachTaskDetailsProperty from '../EachTaskDetailsProperty'
import { TaskPriorityProperty, TaskStatusProperty, TaskTimeframeProperty, TaskAssigneeProperty } from '../../TaskProperties'
import { TaskPriority, TaskStatus, Task } from '@/types/tasks.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbCircleCheck, TbPaperclip } from 'react-icons/tb'
import TaskDescription from './TaskDescription'
import TaskActionItems from './TaskActionItems'
import TaskDetailsAttachments from './TaskDetailsAttachments'

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
    const taskName = task?.name || 'Implement user authentication system with OAuth integration'
    const taskStatus = task?.status || TaskStatus.TODO
    const taskPriority = task?.priority || TaskPriority.HIGH
    const taskTimeframe = task?.timeframe || { start: '2024-07-23', end: '2024-07-29' }
    const taskAssignees = task?.assignee || []
    const taskDescription = task?.description

    return (
        <div className="h-full">
            <div className='space-y-10 p-4'>
                <div className='space-y-6'>
                    <div className='p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors' id='task-description'>
                        <h1 className='text-2xl font-bold line-clamp-3 leading-tight'>
                            {taskName}
                        </h1>
                    </div>

                    <div className='grid grid-cols-1 gap-y-6 gap-x-4'>
                        <EachTaskDetailsProperty
                            label='Status'
                        >
                            <TaskStatusProperty value={taskStatus} />
                        </EachTaskDetailsProperty>
                        <EachTaskDetailsProperty
                            label='Priority'
                        >
                            <TaskPriorityProperty value={taskPriority} />
                        </EachTaskDetailsProperty>
                        <EachTaskDetailsProperty
                            label='Timeframe'
                        >
                            <TaskTimeframeProperty value={taskTimeframe} />
                        </EachTaskDetailsProperty>
                        <EachTaskDetailsProperty
                            label='Assignees'
                        >
                            <TaskAssigneeProperty value={taskAssignees} />
                        </EachTaskDetailsProperty>
                    </div>
                </div>

                <TaskDescription description={taskDescription} />

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
                        </TabsList>                        <TabsContent value="checklist" className="mt-4">
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