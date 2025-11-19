'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'

interface UploadTaskFilesResponse {
  success: boolean
  message: string
  payload: Array<{
    _id: string
    name: string
    size: number
    mimeType: string
    fileURL: string
    fileKey: string
    task: string
    workspace: string
    space: string
    createdBy: string
    createdAt: string
    updatedAt: string
  }>
}

export function useUploadTaskFiles(listId: string, taskId: string) {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await api.post<UploadTaskFilesResponse>(
        `/lists/${listId}/tasks/${taskId}/files`,
        formData,
        {
          headers: {
            'x-member-id': member_id,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['task-details', listId, taskId, member_id]
      })
    },
  })
}
