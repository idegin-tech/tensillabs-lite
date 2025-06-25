'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { VisibilityState } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { useParams } from 'next/navigation'
import { TaskList } from '@/types/tasks.types'

export type GroupByType = 'none' | 'status' | 'priority' | 'due_date'

interface GetListDetailsResponse {
    success: boolean
    message: string
    payload: TaskList
}

interface TaskListState {
    visibleColumns: VisibilityState
    activeList: TaskList | null
    groupBy: GroupByType
    meMode: boolean
    isLoading: boolean
    error: Error | null
    expandedGroup: string | null
}

interface TaskListContextType {
    state: TaskListState
    updateState: (updates: Partial<TaskListState>) => void
    refetchList: () => void
}

const TaskListContext = createContext<TaskListContextType | undefined>(undefined)

export function TaskListProvider({ children }: { children: ReactNode }) {
    const { member_id } = useCommon()
    const params = useParams()
    const listId = params.list_id as string
      const [state, setState] = useState<TaskListState>({
        visibleColumns: {},
        activeList: null,
        groupBy: 'status',
        meMode: false,
        isLoading: true,
        error: null,
        expandedGroup: null
    })

    const listQuery = useQuery({
        queryKey: ['list-details', listId, member_id],
        queryFn: async () => {
            const response = await api.get<GetListDetailsResponse>(`/lists/${listId}`, {
                headers: {
                    'x-member-id': member_id,
                },
            })
            return response
        },
        enabled: !!(listId && member_id),
        staleTime: 90 * 1000,
    })

    useEffect(() => {
        setState(prev => ({
            ...prev,
            isLoading: listQuery.isLoading,
            error: listQuery.error as Error | null,
            activeList: listQuery.data?.payload || null
        }))
    }, [listQuery.data, listQuery.isLoading, listQuery.error])

    const updateState = (updates: Partial<TaskListState>) => {
        setState(prev => {
            const newState = { ...prev, ...updates }
            
            if (updates.groupBy && updates.groupBy !== prev.groupBy) {
                newState.expandedGroup = null
            }
            
            return newState
        })
    }

    const refetchList = () => {
        listQuery.refetch()
    }

    return (
        <TaskListContext.Provider value={{ state, updateState, refetchList }}>
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
