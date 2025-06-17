'use client'
import React, { useState } from 'react'
import { TbLayoutList, TbChevronDown, TbChevronUp, TbPlus } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TablePlaceholder from '@/components/placeholders/TablePlaceholder'
import { TaskStatus, TaskGroupProps } from '@/types/tasks.types'
import { mockTasks } from './_mock_tasks'
import TasksTable from './TasksTable'
import CreateTaskPopup from '../../../../../components/CreateTaskPopup'

export default function EachTaskGroup({
    title = "To Do",
    status = TaskStatus.TODO,
    tasks = mockTasks,
    isLoading = false,
    icon: Icon = TbLayoutList,
    color = "bg-primary/10 text-primary",
    groupConfig
}: TaskGroupProps) {
    const [isExpanded, setIsExpanded] = useState(groupConfig?.defaultOpen ?? true);
    const [showCreateTask, setShowCreateTask] = useState(false);

    const displayTasks = mockTasks.slice(0, 5)
    const taskCount = displayTasks.length

    const handleAddTask = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent expanding/collapsing when clicking add button
        setShowCreateTask(true);
    };

    return (
        <>
            <div className='px-3 sticky top-0 z-50 bg-background h-16 flex items-center'>
                <header
                    className='border-b border-border flex justify-between items-center gap-2 p-2 cursor-pointer bg-card transition-colors duration-200 rounded-lg w-full'
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className='flex items-center gap-3'>
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', color)}>
                            <Icon className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{title}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleAddTask}
                            className="h-7 p-0 hover:bg-sidenav text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <TbPlus className="h-4 w-4" /> Add Task
                        </Button>
                        <Badge variant="default" className="text-xs">
                            {taskCount}
                        </Badge>
                        {isExpanded ? (
                            <TbChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        ) : (
                            <TbChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        )}
                    </div>
                </header>
            </div>
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out mb-16',
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                )}
            >                <div className='px-3'>
                    {isLoading ? (
                        <TablePlaceholder rows={3} columns={6} showHeader={true} />
                    ) : (
                        <TasksTable tasks={displayTasks} />
                    )}
                </div>
            </div>

            {showCreateTask && (
                <CreateTaskPopup
                    isOpen={showCreateTask}
                    onClose={() => setShowCreateTask(false)}
                    groupInfo={{
                        title,
                        status,
                        icon: Icon,
                        color
                    }}
                />
            )}
        </>
    )
}
