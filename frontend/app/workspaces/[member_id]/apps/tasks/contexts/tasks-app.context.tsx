'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import type { 
  Space, 
  SpaceParticipant, 
  GetSpacesResponse, 
  TasksAppState, 
  TasksAppContextType 
} from '@/types/spaces.types'

const TasksAppContext = createContext<TasksAppContextType | undefined>(undefined)

export function TasksAppProvider({ children }: { children: ReactNode }) {
    const { member_id } = useCommon()
    const [state, setState] = useState<TasksAppState>({
        showCreateSpace: false,
        showCreateList: false,
        spaces: [],
        isLoading: true,
        error: null
    })

    const spacesQuery = useInfiniteQuery({
        queryKey: ['spaces', member_id],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await api.get<GetSpacesResponse>('/spaces', {
                params: {
                    page: pageParam,
                    limit: 12,
                    sortBy: '-createdAt',
                },
                headers: {
                    'x-member-id': member_id,
                },
            })
            return response
        },
        getNextPageParam: (lastPage) => {
            return lastPage.payload.hasNextPage ? lastPage.payload.page + 1 : undefined
        },
        initialPageParam: 1,
        enabled: !!member_id,
    })

    useEffect(() => {
        setState(prev => ({
            ...prev,
            isLoading: spacesQuery.isLoading,
            error: spacesQuery.error
        }))

        if (spacesQuery.data) {
            const allSpaces = spacesQuery.data.pages.flatMap(page => 
                page.payload.docs.map(doc => doc.space)
            ).filter(Boolean)
            
            setState(prev => ({
                ...prev,
                spaces: allSpaces,
            }))
        }
    }, [spacesQuery.data, spacesQuery.isLoading, spacesQuery.error])

    const updateState = (updates: Partial<TasksAppState>) => {
        setState(prev => ({ ...prev, ...updates }))
    }

    const refetchSpaces = () => {
        spacesQuery.refetch()
    }

    const fetchNextPage = () => {
        spacesQuery.fetchNextPage()
    }

    return (
        <TasksAppContext.Provider value={{ 
            state, 
            updateState, 
            refetchSpaces,
            fetchNextPage,
            hasNextPage: spacesQuery.hasNextPage || false,
            isFetchingNextPage: spacesQuery.isFetchingNextPage
        }}>
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
