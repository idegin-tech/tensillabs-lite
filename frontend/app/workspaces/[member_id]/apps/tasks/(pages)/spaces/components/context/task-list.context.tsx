'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { VisibilityState } from '@tanstack/react-table'

interface TaskListContextState {
  visibleColumns: VisibilityState
}

interface TaskListContextValue {
  state: TaskListContextState
  updateState: (updates: Partial<TaskListContextState>) => void
}

const TaskListContext = createContext<TaskListContextValue | undefined>(undefined)

export function TaskListProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TaskListContextState>({
    visibleColumns: {}
  })

  const updateState = (updates: Partial<TaskListContextState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  return (
    <TaskListContext.Provider value={{ state, updateState }}>
      {children}
    </TaskListContext.Provider>
  )
}

export function useTaskList() {
  const context = useContext(TaskListContext)
  if (context === undefined) {
    throw new Error('useTaskList must be used within a TaskListProvider')
  }
  return context
}
