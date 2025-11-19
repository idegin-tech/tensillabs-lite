'use client'

import React, { useState, useEffect } from 'react'
import { TaskPropertyProps } from '.'
import { Task } from '@/types/tasks.types'
import TaskBlockingSelector from '../TaskTaskSelector'

interface TaskBlockingPropertyProps extends TaskPropertyProps {
  value?: string[]
  currentTaskId?: string
  allTasks?: Task[]
  displayMode?: 'compact' | 'full'
}

export default function TaskBlockingProperty({ 
  onChange, 
  value = [], 
  currentTaskId,
  allTasks = [],
  displayMode = 'full'
}: TaskBlockingPropertyProps) {
  const [internalValue, setInternalValue] = useState<string[]>(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = (newValue: string[]) => {
    setInternalValue(newValue)
    setTimeout(() => {
        // onChange?.(newValue)
    }, 100)
  }

  return (
    <TaskBlockingSelector
      value={internalValue}
      onChange={handleChange}
      currentTaskId={currentTaskId}
      allTasks={allTasks}
      displayMode={displayMode}
    />
  )
}
