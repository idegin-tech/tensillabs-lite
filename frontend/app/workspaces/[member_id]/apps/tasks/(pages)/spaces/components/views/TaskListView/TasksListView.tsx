'use client'
import React, { useState } from 'react'
import EachTaskGroup from './EachTaskGroup'
import TasksListOptions from './TasksListOptions'
import { useTaskList } from '../../../../../contexts/task-list.context'
import { taskGroupConfig } from '../../../../../task-app.config'

export default function TasksListView() {
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useTaskList();

    const currentGroupConfig = state.groupBy === 'none' ? [] : (taskGroupConfig[state.groupBy] || [])
    
    return (
        <>
            <div>
                <TasksListOptions />
                <div className='grid grid-cols-1 gap-6 pb-60 h-[calc(100dvh-9.5rem)] overflow-y-auto relative'>
                    <div className="space-y-1 px-3 pt-6">
                        <h1 className="text-2xl font-bold text-foreground">
                            {state.activeList?.name || 'Task List'}
                        </h1>
                        <p className="text-muted-foreground">
                            {state.activeList?.description || 'Manage and track your tasks organized by status'}
                        </p>
                    </div>                    <div className='grid grid-cols-1'>                        
                        {state.groupBy === 'none' ? (
                            <EachTaskGroup
                                key="no-group"
                                title="All Tasks"
                                tasks={[]}
                                isLoading={isLoading}
                                icon={undefined}
                                color="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                groupConfig={undefined}
                            />
                        ) : (
                            currentGroupConfig.map((group) => (
                                <EachTaskGroup
                                    key={`${group.groupKey}-${group.label}`}
                                    title={group.label}
                                    tasks={[]}
                                    isLoading={isLoading}
                                    icon={group.icon}
                                    color={group.color}
                                    groupConfig={group}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
