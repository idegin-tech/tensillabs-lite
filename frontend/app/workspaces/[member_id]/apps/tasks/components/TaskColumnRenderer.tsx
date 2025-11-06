'use client'

import React from 'react'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
import { TaskStatusProperty, TaskPriorityProperty, TaskTimeframeProperty, TaskAssigneeProperty, TaskEstimatedHoursProperty, TaskTagsProperty, TaskBlockedProperty, TaskBlockingProperty } from './TaskProperties'
import { useUpdateTask } from '../hooks/use-tasks'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTaskList } from '../contexts/task-list.context'
import { invalidateTaskGroups } from '../utils/cache-invalidation'

interface TaskColumnRendererProps {
  accessorKey: string
  value: any
  task: Task
  onLocalUpdate?: (taskId: string, updates: Partial<Task>) => void
  allTasks?: Task[]
}

export default function TaskColumnRenderer({
  accessorKey,
  value,
  task,
  onLocalUpdate,
  allTasks = []
}: TaskColumnRendererProps) {
  const params = useParams()
  const listId = params.list_id as string
  const updateTask = useUpdateTask(listId)
  const queryClient = useQueryClient()
  const { state } = useTaskList()

  const handleUpdate = async (field: string, newValue: any) => {
    const previousTask = { ...task }

    const updateData: Record<string, any> = { [field]: newValue }

    if (field === 'assignee' && Array.isArray(newValue)) {
      updateData.assignee = newValue.map((assignee: any) => assignee._id)
    }

    onLocalUpdate?.(task._id, updateData)

    try {
      const response = await updateTask.mutateAsync({
        taskId: task._id,
        data: updateData
      })

      if (response.success) {
        const updatedTask = response.payload

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
      console.error('Failed to update task:', error)
      toast.error('Failed to update task', {
        description: error.message || 'An unexpected error occurred'
      })
      onLocalUpdate?.(task._id, { [field]: value })
    }
  }

  const renderProperty = () => {
    switch (accessorKey) {
      case 'status':
        return (
          <TaskStatusProperty
            value={value as TaskStatus}
            onChange={(newValue) => handleUpdate('status', newValue)}
          />
        )

      case 'priority':
        return (
          <TaskPriorityProperty
            value={value as TaskPriority}
            onChange={(newValue) => handleUpdate('priority', newValue)}
          />
        )

      case 'timeframe':
        return (
          <TaskTimeframeProperty
            value={value}
            onChange={(newValue) => handleUpdate('timeframe', newValue)}
          />
        )

      case 'assignee':
        return (
          <TaskAssigneeProperty
            value={value || []}
            onChange={(newValue) => handleUpdate('assignee', newValue)}
          />
        )

      case 'estimatedHours':
        return (
          <TaskEstimatedHoursProperty
            value={value}
            onChange={(newValue) => handleUpdate('estimatedHours', newValue)}
          />
        )

      case 'tags':
        return (
          <TaskTagsProperty
            value={value || []}
            onChange={(newValue) => handleUpdate('tags', newValue)}
            availableTags={state.activeList?.tags || []}
            listId={listId}
          />
        )

      case 'blocked':
        return (
          <TaskBlockedProperty
            value={task.blockedReason}
            onChange={(newValue) => handleUpdate('blockedReason', newValue)}
          />
        )

      case 'blockingTasks':
        return (
          <TaskBlockingProperty
            value={task.blockedByTaskIds || []}
            onChange={(newValue) => handleUpdate('blockedByTaskIds', newValue)}
            currentTaskId={task._id}
            allTasks={allTasks}
            displayMode='compact'
          />
        )

      default:
        return <span>{value || 'No value'}</span>
    }
  }

  return renderProperty()
}
