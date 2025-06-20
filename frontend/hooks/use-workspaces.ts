'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { Workspace } from '@/types/workspace.types'

interface CreateWorkspaceData {
  name: string
  description?: string
}

interface CreateWorkspaceResponse {
  success: boolean
  payload: {
    workspace: Workspace
    member: {
      _id: string
      workspace: string
      user: string
      permission: string
    }
  }
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation<CreateWorkspaceResponse, ApiError, CreateWorkspaceData>({
    mutationFn: (data: CreateWorkspaceData) =>
      api.post<CreateWorkspaceResponse>('/workspaces', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-memberships'] })
    },
  })
}
