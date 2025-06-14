'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import type { TaskList } from '@/types/spaces.types'

interface GetListsResponse {
  success: boolean
  message: string
  payload: TaskList[]
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
