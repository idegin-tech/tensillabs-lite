'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { api } from '@/lib/api'
import useCommon from './use-common'
import type {
  GetSpaceParticipantsResponse,
  PaginatedSpaceParticipants,
  SpaceParticipantWithMember,
} from '@/types/spaces.types'
import type { ApiError } from '@/lib/api-client'

interface UseSpaceParticipantsParams {
  spaceId: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

interface UseSpaceParticipantsOptions {
  enabled?: boolean
}

export function useSpaceParticipants(
  params: UseSpaceParticipantsParams,
  options: UseSpaceParticipantsOptions = {}
) {
  const { member_id } = useCommon()
  const { spaceId, page = 1, limit = 10, search = '', sortBy = '-createdAt' } = params
  const { enabled = true } = options

  const buildEndpoint = () => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    })

    if (search) searchParams.append('search', search)

    return `/spaces/${spaceId}/participants?${searchParams.toString()}`
  }

  const query = useQuery<GetSpaceParticipantsResponse, ApiError>({
    queryKey: [
      'space-participants',
      spaceId,
      member_id || '',
      page.toString(),
      limit.toString(),
      search,
      sortBy,
    ],
    queryFn: () =>
      api.get<GetSpaceParticipantsResponse>(buildEndpoint(), {
        headers: {
          'x-member-id': member_id,
        },
      }),
    staleTime: 5 * 60 * 1000,
    enabled: !!member_id && !!spaceId && enabled,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })
  const participants = useMemo(() => {
    if (Array.isArray(query.data?.payload)) {
      return query.data.payload.map((participant: any) => ({
        ...participant,
        permissions: participant.role || participant.permissions
      }))
    }
    return query.data?.payload?.docs || []
  }, [query.data])

  const pagination = useMemo(() => {
    if (Array.isArray(query.data?.payload)) {
      return {
        totalDocs: query.data.payload.length,
        limit: query.data.payload.length,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        pagingCounter: 1,
        prevPage: undefined,
        nextPage: undefined,
      }
    }
    if (!query.data?.payload) return null
    return {
      totalDocs: query.data.payload.totalDocs,
      limit: query.data.payload.limit,
      page: query.data.payload.page,
      totalPages: query.data.payload.totalPages,
      hasNextPage: query.data.payload.hasNextPage,
      hasPrevPage: query.data.payload.hasPrevPage,
      pagingCounter: query.data.payload.pagingCounter,
      prevPage: query.data.payload.prevPage,
      nextPage: query.data.payload.nextPage,
    }
  }, [query.data])

  return {
    participants,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

interface UpdateParticipantData {
  participantId: string
  spaceId: string
  permissions?: string
  status?: string
}

export function useUpdateSpaceParticipant() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<
    { success: boolean; payload: SpaceParticipantWithMember },
    ApiError,
    UpdateParticipantData
  >({
    mutationFn: ({ participantId, spaceId, ...data }) =>
      api.put<{ success: boolean; payload: SpaceParticipantWithMember }>(
        `/spaces/${spaceId}/participants/${participantId}`,
        data,
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['space-participants', variables.spaceId, member_id || ''],
      })
    },
  })
}

interface InviteParticipantData {
  spaceId: string
  memberId: string
  permissions?: string
}

export function useInviteSpaceParticipant() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<
    { success: boolean; payload: SpaceParticipantWithMember },
    ApiError,
    InviteParticipantData
  >({    mutationFn: ({ spaceId, memberId, permissions }) =>
      api.post<{ success: boolean; payload: SpaceParticipantWithMember }>(
        `/spaces/${spaceId}/participants`,
        { memberId, permissions },
        {
          headers: {
            'x-member-id': member_id,
          },
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['space-participants', variables.spaceId, member_id || ''],
      })
    },
  })
}

export default useSpaceParticipants
