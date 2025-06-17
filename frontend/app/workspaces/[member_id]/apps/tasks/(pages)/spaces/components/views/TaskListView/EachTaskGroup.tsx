'use client'
import React, { useState, useEffect } from 'react'
import { TbLayoutList, TbChevronDown, TbChevronUp, TbPlus } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TablePlaceholder from '@/components/placeholders/TablePlaceholder'
import { TaskStatus, TaskGroupProps, Task } from '@/types/tasks.types'
import TasksTable from './TasksTable'
import CreateTaskPopup from '../../../../../components/CreateTaskPopup'
import { useGetTasksByGroup } from '../../../../../hooks/use-tasks'
import { useParams } from 'next/navigation'
import { useTaskList } from '../../../../../contexts/task-list.context'
import { useQueryClient } from '@tanstack/react-query'

export default function EachTaskGroup({
    title = "To Do",
    status = TaskStatus.TODO,
    tasks = [],
    isLoading = false,
    icon: Icon = TbLayoutList,
    color = "bg-primary/10 text-primary",
    groupConfig
}: TaskGroupProps) {
    const params = useParams()
    const listId = params.list_id as string
    const { state } = useTaskList()
    const queryClient = useQueryClient()
    const [isExpanded, setIsExpanded] = useState(groupConfig?.defaultOpen ?? false)
    const [showCreateTask, setShowCreateTask] = useState(false)
    const [localTasks, setLocalTasks] = useState<Task[]>([])
    const [page, setPage] = useState(1)
    const [tableVisible, setTableVisible] = useState(isExpanded)

    const groupParams = {
        page,
        limit: 20,
        meMode: state.meMode,
        ...groupConfig?.query
    }

    const { data: tasksData, isLoading: isApiLoading } = useGetTasksByGroup(
        listId, 
        groupParams, 
        isExpanded
    )

    const apiTasks = tasksData?.payload?.tasks || []
    const hasMore = tasksData?.payload?.hasMore || false
    const displayTasks = localTasks.length > 0 ? localTasks : apiTasks
    const taskCount = displayTasks.length

    useEffect(() => {
        if (apiTasks.length > 0) {
            setLocalTasks(apiTasks)
        }
    }, [apiTasks])

    useEffect(() => {
        if (isExpanded) {
            setTableVisible(true)
        } else {
            const timer = setTimeout(() => {
                setTableVisible(false)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [isExpanded])

    const handleAddTask = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowCreateTask(true)
    }

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }

    const handleExpansionToggle = () => {
        setIsExpanded(!isExpanded)
    }

    const handleTaskCreated = (newTask: Task) => {
        setLocalTasks(prev => [newTask, ...prev])
        
        queryClient.invalidateQueries({
            queryKey: [`tasks-by-group`, listId]
        })
        
        setShowCreateTask(false)
    }

    const handleCreateTaskClose = () => {
        setShowCreateTask(false)
        
        queryClient.invalidateQueries({
            queryKey: [`tasks-by-group`, listId]
        })
    }

    const getGroupInfoForCreate = () => {
        if (!groupConfig) return undefined

        let extractedStatus: TaskStatus | undefined = undefined
        let extractedPriority: any = undefined

        if (groupConfig.query.status) {
            extractedStatus = groupConfig.query.status as TaskStatus
        }
        if (groupConfig.query.priority && groupConfig.query.priority !== 'none') {
            extractedPriority = groupConfig.query.priority
        }

        return {
            title,
            status: extractedStatus,
            priority: extractedPriority,
            icon: Icon,
            color
        }
    }

    return (
        <div>
            <div className='px-3 sticky top-0 z-50 h-16 flex items-center bg-gradient-to-tr from-background to-sidebar'>
                <header
                    className='border-b border-border flex justify-between items-center gap-2 p-2 cursor-pointer bg-card transition-colors duration-200 rounded-lg w-full'
                    onClick={handleExpansionToggle}
                >
                    <div className='flex items-center gap-3'>
                        {Icon && (
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', color)}>
                                <Icon className="h-4 w-4" />
                            </div>
                        )}
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
                    'transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-[2000px] opacity-100 mb-16' : 'max-h-0 opacity-0'
                )}
            >
                {tableVisible && (
                    <div className='px-3'>
                        {isApiLoading && page === 1 ? (
                            <TablePlaceholder rows={3} columns={6} showHeader={true} />
                        ) : (
                            <>
                                <TasksTable tasks={displayTasks} />
                                {hasMore && (
                                    <div className="flex justify-center py-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={handleLoadMore}
                                            disabled={isApiLoading}
                                        >
                                            {isApiLoading ? 'Loading...' : 'Load 20 more'}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>            {showCreateTask && (
                <CreateTaskPopup
                    isOpen={showCreateTask}
                    onClose={handleCreateTaskClose}
                    onTaskCreated={handleTaskCreated}
                    groupInfo={getGroupInfoForCreate()}
                />
            )}
        </div>
    )
}
