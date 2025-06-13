'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface TasksAppState {
    showCreateSpace: boolean
    showCreateList: boolean
}

interface TasksAppContextType {
    state: TasksAppState
    updateState: (updates: Partial<TasksAppState>) => void
}

const TasksAppContext = createContext<TasksAppContextType | undefined>(undefined)

export function TasksAppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<TasksAppState>({
        showCreateSpace: false,
        showCreateList: false
    })

    const updateState = (updates: Partial<TasksAppState>) => {
        setState(prev => ({ ...prev, ...updates }))
    }

    return (
        <TasksAppContext.Provider value={{ state, updateState }}>
            {children}
        </TasksAppContext.Provider>
    )
}

export function useTasksApp() {
    const context = useContext(TasksAppContext)
    if (context === undefined) {
        throw new Error('useTasksApp must be used within a TasksAppProvider')
    }
    return context
}
