'use client'

import React, { useEffect, useRef } from 'react'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import { Task } from '@/types/tasks.types'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'
import { useGetTasksByGroup } from '../../hooks/use-tasks'
import { useTaskList } from '../../contexts/task-list.context'

interface TaskTimelineGanttProps {
    tasks?: Task[]
    className?: string
}

interface GanttTask {
    id: string
    text: string
    start_date: string
    duration: number
    progress: number
    parent?: string
    type?: string
}

export default function TaskTimelineGantt({ tasks = [], className = '' }: TaskTimelineGanttProps) {
    const ganttRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const listId = params.list_id as string
    const { state } = useTaskList()

    const { data: allTasksData, isLoading } = useGetTasksByGroup(
        listId,
        {
            page: 1,
            limit: 100,
            groupBy: 'none',
            meMode: state.meMode
        },
        true
    )

    const allTasks = allTasksData?.payload?.tasks || tasks
    const tasksWithTimeframes = allTasks.filter(task => task.timeframe?.start && task.timeframe?.end)

    useEffect(() => {
        if (!ganttRef.current) return

        gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
        gantt.config.scale_unit = 'day'
        gantt.config.date_scale = '%d %M'
        gantt.config.scale_height = 50
        gantt.config.row_height = 40
        gantt.config.grid_width = 350
        gantt.config.autofit = true
        gantt.config.readonly = true
        gantt.config.show_progress = true
        gantt.config.show_links = false

        gantt.config.columns = [
            { name: 'text', label: 'Task Name', width: 200, tree: true },
            { name: 'status', label: 'Status', width: 80, align: 'center' },
            { name: 'priority', label: 'Priority', width: 70, align: 'center' }
        ]

        gantt.templates.task_class = function (start, end, task) {
            const taskData = tasksWithTimeframes.find(t => t._id === task.id)
            if (!taskData) return ''

            switch (taskData.status) {
                case 'completed':
                    return 'gantt-task-completed'
                case 'in_progress':
                    return 'gantt-task-in-progress'
                case 'in_review':
                    return 'gantt-task-in-review'
                case 'canceled':
                    return 'gantt-task-canceled'
                default:
                    return 'gantt-task-todo'
            }
        }

        gantt.templates.progress_text = function (start, end, task) {
            const taskData = tasksWithTimeframes.find(t => t._id === task.id)
            if (!taskData) return ''
            return getStatusText(taskData.status)
        }

        gantt.init(ganttRef.current)

        return () => {
            gantt.clearAll()
        }
    }, [tasksWithTimeframes])

    useEffect(() => {
        if (!tasksWithTimeframes.length) return

        const ganttTasks = transformTasksToGanttFormat(tasksWithTimeframes)

        gantt.clearAll()
        gantt.parse({
            data: ganttTasks,
            links: []
        })
    }, [tasksWithTimeframes])

    const transformTasksToGanttFormat = (tasks: Task[]): GanttTask[] => {
        return tasks.map(task => {
            const startDate = new Date(task.timeframe!.start!)
            const endDate = new Date(task.timeframe!.end!)
            const durationInDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

            let progress = 0
            switch (task.status) {
                case 'completed':
                    progress = 100
                    break
                case 'in_progress':
                    progress = 50
                    break
                case 'in_review':
                    progress = 80
                    break
                default:
                    progress = 0
            }

            return {
                id: task._id,
                text: task.name,
                start_date: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
                duration: durationInDays,
                progress: progress,
                status: task.status,
                priority: task.priority || 'normal'
            }
        })
    }

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'Completed'
            case 'in_progress':
                return 'In Progress'
            case 'in_review':
                return 'In Review'
            case 'canceled':
                return 'Canceled'
            default:
                return 'To Do'
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading timeline...</p>
                </div>
            </div>
        )
    }

    if (tasksWithTimeframes.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Timeline Data</h3>
                    <p className="text-muted-foreground mb-4">Tasks need start and end dates to appear in the timeline view.</p>
                    <p className="text-sm text-muted-foreground">Add timeframes to your tasks to see them here.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full h-full ${className}`}>
            <style jsx global>{`
            
      `}</style>
            <div ref={ganttRef} className="w-full h-full min-h-[500px] grid grid-cols-1" />
        </div>
    )
}
