'use client'
import { useQuery } from '@tanstack/react-query'
import { useApiMutation } from '@/hooks/use-api'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import type { TaskList, TaskTag } from '@/types/tasks.types'

interface GetListsResponse {
  success: boolean
  message: string
  payload: TaskList[]
}

interface UpdateListResponse {
  success: boolean
  message: string
  payload: TaskList
}

interface UpdateListData {
  tags?: TaskTag[]
}

export function useGetListsBySpace(spaceId: string, enabled = true) {
  const { member_id } = useCommon()

  return useQuery({
    queryKey: ['lists', spaceId, member_id],
    queryFn: async () => {
      const response = await api.get<GetListsResponse>(`/spaces/${spaceId}/lists`, {
        headers: {
          'x-member-id': member_id,
        },
      })
      return response
    },
    enabled: !!(spaceId && member_id && enabled),
    staleTime: 2 * 60 * 1000,
  })
}

export function useUpdateList() {
  const { member_id } = useCommon()

  return useApiMutation<UpdateListResponse, { listId: string; data: UpdateListData }>({
    mutationFn: async ({ listId, data }) => {
      if (data.tags) {
        const response = await api.put<UpdateListResponse>(
          `/lists/${listId}/tags`,
          { tags: data.tags },
          {
            headers: {
              'x-member-id': member_id,
            },
          }
        )
        return response
      }
      
      const response = await api.put<UpdateListResponse>(
        `/lists/${listId}`,
        data,
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      )
      return response
    },
    invalidateKeys: (variables) => [
      ['list-details', variables?.listId, member_id]
    ],
  })
}
