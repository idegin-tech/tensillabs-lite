'use client'

import React from 'react'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
import { TaskStatusProperty, TaskPriorityProperty, TaskTimeframeProperty, TaskAssigneeProperty } from './TaskProperties'
import { useUpdateTask } from '../hooks/use-tasks'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface TaskColumnRendererProps {
  accessorKey: string
  value: any
  task: Task
  onLocalUpdate?: (taskId: string, updates: Partial<Task>) => void
}

export default function TaskColumnRenderer({ 
  accessorKey, 
  value, 
  task,
  onLocalUpdate 
}: TaskColumnRendererProps) {
  const params = useParams()
  const listId = params.list_id as string
  const updateTask = useUpdateTask(listId)
  const queryClient = useQueryClient()
  
  const handleUpdate = async (field: string, newValue: any) => {
    try {
      const updateData: Record<string, any> = { [field]: newValue }
      
      if (field === 'assignee' && Array.isArray(newValue)) {
        updateData.assignee = newValue.map((assignee: any) => assignee._id)
        onLocalUpdate?.(task._id, { [field]: newValue })
      } else {
        onLocalUpdate?.(task._id, updateData)
      }

      const response = await updateTask.mutateAsync({
        taskId: task._id,
        data: updateData
      })

      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: [`tasks-by-group`, listId]
        })
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

      default:
        return <span>{value || 'No value'}</span>
    }
  }

  return renderProperty()
}
