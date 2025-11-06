'use client'
import React, { useState, useEffect } from 'react'
import { TbLayoutList, TbChevronDown, TbChevronUp, TbPlus, TbAlertTriangle, TbRefresh } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TablePlaceholder from '@/components/placeholders/TablePlaceholder'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { TaskStatus, TaskGroupProps, Task } from '@/types/tasks.types'
import TasksTable from './TasksTable'
import CreateTaskPopup from '../../../../../components/CreateTaskPopup'
import { useGetTasksByGroup } from '../../../../../hooks/use-tasks'
import { useParams } from 'next/navigation'
import { useTaskList } from '../../../../../contexts/task-list.context'
import { useTasksApp } from '../../../../../contexts/tasks-app.context'
import { useQueryClient } from '@tanstack/react-query'

export default function EachTaskGroup({
    title = "To Do",
    icon: Icon = TbLayoutList,
    color = "bg-primary/10 text-primary",
    groupConfig
}: TaskGroupProps) {
    const params = useParams()
    const listId = params.list_id as string
    const { state, updateState } = useTaskList()
    const { updateState: updateTasksAppState } = useTasksApp()
    const queryClient = useQueryClient()
    
    const groupKey = groupConfig ? `${groupConfig.groupKey}-${groupConfig.label}` : 'no-group'
    const isExpanded = state.expandedGroup === groupKey
    
    const [showCreateTask, setShowCreateTask] = useState(false)
    const [localTasks, setLocalTasks] = useState<Task[]>([])
    const [page, setPage] = useState(1)
    const [tableVisible, setTableVisible] = useState(isExpanded)
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)

    const groupParams = {
        page,
        limit: 50,
        meMode: state.meMode,
        ...groupConfig?.query
    }

    const { data: tasksData, isLoading: isApiLoading, error, refetch } = useGetTasksByGroup(
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
            if (!hasInitiallyLoaded) {
                setHasInitiallyLoaded(true)
            }
        } else if (apiTasks.length === 0 && hasInitiallyLoaded) {
            setLocalTasks([])
        }
    }, [tasksData, hasInitiallyLoaded])

    useEffect(() => {
        if (tasksData && !hasInitiallyLoaded) {
            setHasInitiallyLoaded(true)
        }
    }, [tasksData])

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

    const invalidateData = () => {
        setPage(1)
        setLocalTasks([])
        setHasInitiallyLoaded(false)
        queryClient.invalidateQueries({
            queryKey: [`tasks-by-group`, listId, JSON.stringify(groupParams)],
            exact: true
        })
        refetch()
    }

    const handleAddTask = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowCreateTask(true)
    }

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }

    const handleRetry = () => {
        setHasInitiallyLoaded(false)
        refetch()
    }

    const handleExpansionToggle = () => {
        if (isExpanded) {
            updateState({ expandedGroup: null })
        } else {
            updateState({ expandedGroup: groupKey })
            setLocalTasks([])
            setHasInitiallyLoaded(false)
            queryClient.invalidateQueries({
                queryKey: [`tasks-by-group`, listId, JSON.stringify(groupParams)]
            })
            setTimeout(() => {
                refetch()
            }, 100)
        }
    }

    const handleTaskCreated = (newTask: Task) => {
        setLocalTasks(prev => [newTask, ...prev])
        setShowCreateTask(false)
    }

    const handleCreateTaskClose = () => {
        setShowCreateTask(false)
    }

    const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
        const previousTask = localTasks.find(task => task._id === taskId)
        
        if (previousTask && state.groupBy !== 'none') {
            const hasGroupingFieldChanged = 
                (state.groupBy === 'status' && updates.status && updates.status !== previousTask.status) ||
                (state.groupBy === 'priority' && updates.priority !== undefined && updates.priority !== previousTask.priority) ||
                (state.groupBy === 'due_date' && updates.timeframe?.end !== previousTask.timeframe?.end)

            if (hasGroupingFieldChanged) {
                setLocalTasks(prev => prev.filter(task => task._id !== taskId))
                setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: [`tasks-by-group`, listId],
                        exact: false
                    })
                }, 500)
                return
            }
        }

        setLocalTasks(prev =>
            prev.map(task =>
                task._id === taskId ? { ...task, ...updates } : task
            )
        )
    }

    const handleTaskClick = (taskId: string) => {
        updateTasksAppState({ activeTaskID: taskId })
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

    useEffect(() => {
        const handleStorageChange = () => {
            if (isExpanded) {
                invalidateData()
            }
        }
        
        window.addEventListener('task-group-invalidated', handleStorageChange)
        return () => window.removeEventListener('task-group-invalidated', handleStorageChange)
    }, [isExpanded])

    return (
        <>
            <div className='px-3 sticky top-0 z-40 h-10 flex items-center bg-gradient-to-tr from-background to-sidebar'>
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
            {
                isExpanded && <>
                    <div
                        className={cn(
                            'transition-all duration-300 ease-in-out z-0 pt-3',
                            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        )}
                    >                        {tableVisible && (
                        <div className='px-3'>
                            {error && !hasInitiallyLoaded && page === 1 ? (
                                <SectionPlaceholder
                                    variant="error"
                                    icon={TbAlertTriangle}
                                    heading="Failed to load tasks"
                                    subHeading={`We couldn't load tasks for ${title}. Please check your connection and try again.`}
                                    ctaButton={{
                                        label: "Try Again",
                                        onClick: handleRetry,
                                        variant: "outline",
                                        icon: TbRefresh
                                    }}
                                />
                            ) : isApiLoading && page === 1 ? (
                                <TablePlaceholder
                                    rows={3}
                                    columns={6}
                                    showHeader={true}
                                />) : (
                                <>                                        
                                <TasksTable
                                    tasks={displayTasks}
                                    onTaskUpdate={handleTaskUpdate}
                                    onTaskClick={handleTaskClick}
                                />
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
                    </div>
                </>
            }
            {showCreateTask && (
                <CreateTaskPopup
                    isOpen={showCreateTask}
                    onClose={handleCreateTaskClose}
                    onTaskCreated={handleTaskCreated}
                    groupInfo={getGroupInfoForCreate()}
                />
            )}
        </>
    )
}
