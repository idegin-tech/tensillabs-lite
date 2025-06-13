'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { VisibilityState } from '@tanstack/react-table'

interface TaskListState {
    visibleColumns: VisibilityState
}

interface TaskListContextType {
    state: TaskListState
    updateState: (updates: Partial<TaskListState>) => void
}

const TaskListContext = createContext<TaskListContextType | undefined>(undefined)

export function TaskListProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<TaskListState>({
        visibleColumns: {}
    })

    const updateState = (updates: Partial<TaskListState>) => {
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
