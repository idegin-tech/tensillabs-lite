'use client'

import { useApiMutation } from '@/hooks/use-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'

interface ChecklistItem {
  _id: string
  name: string
  isDone: boolean
  task: string
  workspace: string
  space?: string
  list?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateChecklistResponse {
  success: boolean
  message: string
  payload: ChecklistItem
}

interface UpdateChecklistResponse {
  success: boolean
  message: string
  payload: ChecklistItem
}

interface DeleteChecklistResponse {
  success: boolean
  message: string
  payload: ChecklistItem
}

interface CreateChecklistRequest {
  name: string
  task?: string
  space?: string
  list?: string
}

interface UpdateChecklistRequest {
  name?: string
  isDone?: boolean
}

export function useCreateChecklist() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateChecklistRequest) => {
      const response = await api.post<CreateChecklistResponse>('/checklists', data, {
        headers: {
          'x-member-id': member_id,
        },
      })
      return response
    },
    onSuccess: (data, variables) => {
      if (variables.task) {
        queryClient.invalidateQueries({
          queryKey: ['task-details', undefined, variables.task, member_id],
        })
      }
    },
  })
}

export function useUpdateChecklist() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ checklistId, data }: { checklistId: string; data: UpdateChecklistRequest }) => {
      const response = await api.put<UpdateChecklistResponse>(`/checklists/${checklistId}`, data, {
        headers: {
          'x-member-id': member_id,
        },
      })
      return response
    },
    onSuccess: (response) => {
      const checklistItem = response.payload
      if (checklistItem.task) {
        queryClient.invalidateQueries({
          queryKey: ['task-details', undefined, checklistItem.task, member_id],
        })
      }
    },
  })
}

export function useDeleteChecklist() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (checklistId: string) => {
      const response = await api.delete<DeleteChecklistResponse>(`/checklists/${checklistId}`, {
        headers: {
          'x-member-id': member_id,
        },
      })
      return response
    },
    onSuccess: (response) => {
      const checklistItem = response.payload
      if (checklistItem.task) {
        queryClient.invalidateQueries({
          queryKey: ['task-details', undefined, checklistItem.task, member_id],
        })
      }
    },
  })
}
