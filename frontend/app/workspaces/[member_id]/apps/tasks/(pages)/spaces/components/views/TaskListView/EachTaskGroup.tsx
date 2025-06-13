'use client'
import React, { useState, useMemo } from 'react'
import { TbLayoutList, TbChevronDown, TbChevronUp } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import TablePlaceholder from '@/components/placeholders/TablePlaceholder'
import { TaskStatus, TaskGroupProps } from '@/types/tasks.types'
import { mockTasks } from './_mock_tasks'
import TasksTable from './TasksTable'

export default function EachTaskGroup({
    title = "To Do",
    status = TaskStatus.TODO,
    tasks = mockTasks,
    isLoading = false,
    icon: Icon = TbLayoutList,
    color = "bg-primary/10 text-primary"
}: TaskGroupProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const groupTasks = useMemo(() => tasks.filter(task => task.status === status), [tasks, status])
    const taskCount = groupTasks.length

    return (
        <>
            <div className='px-3 sticky top-0 z-40'>
                <header
                    className='border-b border-border flex justify-between items-center gap-2 p-2 cursor-pointer bg-card transition-colors duration-200 rounded-lg'
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
                    'transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className='p-4'>
                    {isLoading ? (
                        <TablePlaceholder rows={3} columns={6} showHeader={true} />
                    ) : (
                        <TasksTable tasks={groupTasks} />
                    )}
                </div>
            </div>
        </>
    )
}
