'use client'

import { useApiMutation, useInvalidateQueries } from '@/hooks/use-api'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { 
  CreateSpaceRequest, 
  Space, 
  SpaceParticipant, 
  GetSpacesResponse, 
  CreateSpaceResponse 
} from '@/types/spaces.types'

export function useCreateSpace() {
  const { member_id } = useCommon()
  const { invalidate } = useInvalidateQueries()

  return useApiMutation<CreateSpaceResponse, CreateSpaceRequest>(
    async (data) => {
      return api.post<CreateSpaceResponse>('/spaces', data, {
        headers: {
          'x-member-id': member_id,
        },
      })
    },
    {
      onSuccess: () => {
        invalidate(['spaces'])
      },
    }
  )
}

export function useGetSpaces() {
  const { member_id } = useCommon()

  return useInfiniteQuery({
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
}