'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import type { WorkspaceMember, Workspace } from '@/types/workspace.types'
import WorkspaceLoading from '@/components/WorkspaceLoading'

interface WorkspaceMemberState {
  member: WorkspaceMember | null
  workspace: Workspace | null
  isLoading: boolean
  error: Error | null
}

interface WorkspaceMemberContextType {
  state: WorkspaceMemberState
  updateState: (updates: Partial<WorkspaceMemberState>) => void
  refetch: () => void
}

interface GetMemberDependenciesResponse {
  success: boolean
  message: string
  payload: {
    member: WorkspaceMember
    workspace: Workspace
  }
}

const WorkspaceMemberContext = createContext<WorkspaceMemberContextType | undefined>(undefined)

export function WorkspaceMemberProvider({ children }: { children: ReactNode }) {
  const { member_id } = useCommon()
  const [state, setState] = useState<WorkspaceMemberState>({
    member: null,
    workspace: null,
    isLoading: true,
    error: null
  })

  const memberQuery = useQuery({
    queryKey: ['member-dependencies', member_id],
    queryFn: async () => {
      const response = await api.get<GetMemberDependenciesResponse>('/workspace-members/dependencies', {
        headers: {
          'x-member-id': member_id,
        },
      })
      return response
    },
    enabled: !!member_id,
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    setState(prev => ({
      ...prev,
      isLoading: memberQuery.isLoading,
      error: memberQuery.error as Error | null,
      member: memberQuery.data?.payload?.member || null,
      workspace: memberQuery.data?.payload?.workspace || null
    }))
  }, [memberQuery.data, memberQuery.isLoading, memberQuery.error])

  const updateState = (updates: Partial<WorkspaceMemberState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const refetch = () => {
    memberQuery.refetch()
  }

  if (state.isLoading) {
    return <WorkspaceLoading />
  }

  return (
    <WorkspaceMemberContext.Provider value={{ state, updateState, refetch }}>
      {children}
    </WorkspaceMemberContext.Provider>
  )
}

export function useWorkspaceMember() {
  const context = useContext(WorkspaceMemberContext)
  if (context === undefined) {
    throw new Error('useWorkspaceMember must be used within a WorkspaceMemberProvider')
  }
  return context
}
