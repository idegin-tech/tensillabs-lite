'use client'

import { useApiMutation } from '@/hooks/use-api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { 
  ChecklistItem, 
  CreateChecklistRequest, 
  UpdateChecklistRequest, 
  CreateChecklistResponse, 
  UpdateChecklistResponse, 
  DeleteChecklistResponse,
  GetChecklistsResponse
} from '@/types/checklist.types'

export function useTaskChecklists(listId: string, taskId: string, enabled = true) {
  const { member_id } = useCommon()

  return useQuery<GetChecklistsResponse>({
    queryKey: ['task-checklists', listId, taskId, member_id],
    queryFn: async () => {
      const response = await api.get<GetChecklistsResponse>(
        `/lists/${listId}/tasks/${taskId}/checklists`,
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      )
      return response
    },
    enabled: !!(listId && taskId && member_id && enabled),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
}

export function useCreateChecklist(listId: string, taskId: string) {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateChecklistRequest) => {
      const response = await api.post<CreateChecklistResponse>(
        `/lists/${listId}/tasks/${taskId}/checklists`, 
        data, 
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      )
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['task-checklists', listId, taskId, member_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['task-details', listId, taskId, member_id],
      })
      queryClient.invalidateQueries({
        queryKey: [`tasks-by-group`, listId],
        exact: false
      })
    },
  })
}

export function useUpdateChecklist(listId: string, taskId: string) {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ checklistId, data }: { checklistId: string; data: UpdateChecklistRequest }) => {
      const response = await api.put<UpdateChecklistResponse>(
        `/lists/${listId}/tasks/${taskId}/checklists/${checklistId}`, 
        data, 
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      )
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['task-checklists', listId, taskId, member_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['task-details', listId, taskId, member_id],
      })
      queryClient.invalidateQueries({
        queryKey: [`tasks-by-group`, listId],
        exact: false
      })
    },
  })
}

export function useDeleteChecklist(listId: string, taskId: string) {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (checklistId: string) => {
      const response = await api.delete<DeleteChecklistResponse>(
        `/lists/${listId}/tasks/${taskId}/checklists/${checklistId}`, 
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      )
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['task-checklists', listId, taskId, member_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['task-details', listId, taskId, member_id],
      })
      queryClient.invalidateQueries({
        queryKey: [`tasks-by-group`, listId],
        exact: false
      })
    },
  })
}
