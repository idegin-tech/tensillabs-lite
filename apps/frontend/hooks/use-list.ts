'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'

interface ListFile {
  _id: string
  name: string
  size: number
  mimeType: string
  fileURL: string
  fileKey: string
  createdAt: string
  updatedAt: string
  task?: {
    _id: string
    name: string
  }
  uploadedBy?: {
    _id: string
    firstName: string
    lastName: string
  }
}

interface ListFilesResponse {
  success: boolean
  message: string
  payload: {
    files: ListFile[]
    totalCount: number
    page: number
    limit: number
    hasMore: boolean
  }
}

interface UseListFilesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'uploadedAt' | 'size' | 'filename'
  sortOrder?: 'asc' | 'desc'
  mimeType?: 'image' | 'video' | 'document' | 'other'
}

export function useListFiles(listId: string, params?: UseListFilesParams) {
  const { member_id } = useCommon()

  return useQuery({
    queryKey: ['list-files', listId, member_id, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
      if (params?.mimeType) queryParams.append('mimeType', params.mimeType)

      const response = await api.get<ListFilesResponse>(
        `/lists/${listId}/files?${queryParams.toString()}`,
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      )
      return response.payload
    },
    enabled: !!listId && !!member_id,
  })
}

interface UpdateListData {
  tags?: any[]
}

interface ApiError {
  message: string
  statusCode: number
}

export function useUpdateList() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<any, ApiError, { listId: string; data: UpdateListData }>({
    mutationFn: ({ listId, data }) =>
      api.put(`/lists/${listId}/tags`, data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['list-details', variables.listId] })
      queryClient.invalidateQueries({ queryKey: ['list-files'] })
    },
  })
}
