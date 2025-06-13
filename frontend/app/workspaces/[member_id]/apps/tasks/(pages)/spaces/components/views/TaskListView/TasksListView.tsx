'use client'
import React, { useState } from 'react'
import EachTaskGroup from './EachTaskGroup'
import { TbCircle, TbClock, TbAlertTriangle, TbCircleCheck } from 'react-icons/tb'
import { TaskStatus } from '@/types/tasks.types'
import { mockTasks } from './_mock_tasks'
import TasksListOptions from './TasksListOptions'


export default function TasksListView() {
    const [isLoading, setIsLoading] = useState(false);

    const taskGroups = [
        {
            title: 'To Do',
            status: TaskStatus.TODO,
            description: 'Tasks that need to be started',
            icon: TbCircle,
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        },
        {
            title: 'In Progress',
            status: TaskStatus.IN_PROGRESS,
            description: 'Tasks currently being worked on',
            icon: TbClock,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        },
        {
            title: 'Review',
            status: TaskStatus.IN_REVIEW,
            description: 'Tasks waiting for review or approval',
            icon: TbAlertTriangle,
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
        },
        {
            title: 'Completed',
            status: TaskStatus.COMPLETED,
            description: 'Tasks that have been finished',
            icon: TbCircleCheck,
            color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'        }
    ]
    
    return (
        <>
            <div>
                <TasksListOptions />
                <div className='grid grid-cols-1 gap-6 pb-60 h-[calc(100dvh-9.5rem)] overflow-y-auto relative'>
                    <div className="space-y-1 px-3 pt-6">
                        <h1 className="text-2xl font-bold text-foreground">Task List</h1>
                        <p className="text-muted-foreground">
                            Manage and track your tasks organized by status
                        </p>
                    </div>
                    <div className='grid grid-cols-1'>
                        {taskGroups.map((group) => (
                            <EachTaskGroup
                                key={group.status}
                                title={group.title}
                                status={group.status}
                                tasks={mockTasks}
                                isLoading={isLoading}
                                icon={group.icon}
                                color={group.color}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
