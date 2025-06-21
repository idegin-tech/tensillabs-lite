'use client'
import React, { useState } from 'react'
import EachTaskGroup from './EachTaskGroup'
import TasksListOptions from './TasksListOptions'
import { useTaskList } from '../../../../../contexts/task-list.context'
import { taskGroupConfig } from '../../../../../task-app.config'

export default function TasksListView() {
    const { state } = useTaskList();

    const currentGroupConfig = state.groupBy === 'none' ? [] : (taskGroupConfig[state.groupBy] || [])

    return (
        <>
            <div>
                <TasksListOptions />
                <div className='grid grid-cols-1 pb-60 h-[calc(100dvh-9.5rem)] overflow-y-auto relative'>
                    <div className="space-y-1 px-3 pt-6 pb-5">
                        <h1 className="text-2xl font-bold text-foreground">
                            {state.activeList?.name || 'Task List'}
                        </h1>
                        <p className="text-muted-foreground">
                            {state.activeList?.description || 'Manage and track your tasks organized by status'}
                        </p>
                    </div>
                    <br />
                    <div className='grid grid-cols-1 gap-0'>
                        {state.groupBy === 'none' ? (
                            <EachTaskGroup
                                key="no-group"
                                title="All Tasks"
                                icon={undefined}
                                color="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                groupConfig={undefined}
                            />
                        ) : (
                            currentGroupConfig.map((group) => (
                                <div key={`${group.groupKey}-${group.label}`} className='pb-5'>
                                    <EachTaskGroup
                                        title={group.label}
                                        icon={group.icon}
                                        color={group.color}
                                        groupConfig={group}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
