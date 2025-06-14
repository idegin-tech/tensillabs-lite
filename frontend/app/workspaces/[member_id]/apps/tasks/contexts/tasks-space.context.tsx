'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { useParams } from 'next/navigation'
import type { 
  TasksSpaceState,
  TasksSpaceContextType,
  GetSpaceDetailsResponse
} from '@/types/spaces.types'

const TasksSpaceContext = createContext<TasksSpaceContextType | undefined>(undefined)

export function TasksSpaceProvider({ children }: { children: ReactNode }) {
    const { member_id } = useCommon()
    const params = useParams()
    const spaceId = params.space_id as string
    
    const [state, setState] = useState<TasksSpaceState>({
        space: null,
        isLoading: true,
        error: null
    })

    const spaceQuery = useQuery({
        queryKey: ['space-details', spaceId, member_id],
        queryFn: async () => {
            const response = await api.get<GetSpaceDetailsResponse>(`/spaces/${spaceId}`, {
                headers: {
                    'x-member-id': member_id,
                },
            })
            return response
        },
        enabled: !!(spaceId && member_id),
        staleTime: 5 * 60 * 1000,
    })

    useEffect(() => {
        setState(prev => ({
            ...prev,
            isLoading: spaceQuery.isLoading,
            error: spaceQuery.error as Error | null,
            space: spaceQuery.data?.payload || null
        }))
    }, [spaceQuery.data, spaceQuery.isLoading, spaceQuery.error])

    const refetchSpace = () => {
        spaceQuery.refetch()
    }

    return (
        <TasksSpaceContext.Provider value={{ 
            state, 
            refetchSpace
        }}>
            {children}
        </TasksSpaceContext.Provider>
    )
}

export function useTasksSpace() {
    const context = useContext(TasksSpaceContext)
    if (context === undefined) {
        throw new Error('useTasksSpace must be used within a TasksSpaceProvider')
    }
    return context
}
