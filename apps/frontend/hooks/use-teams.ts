'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { Team, PaginatedTeams, CreateTeamData, UpdateTeamData } from '@/types/teams.types'
import useCommon from './use-common'

interface UseTeamsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  isActive?: string
}

interface UseTeamsOptions {
  enabled?: boolean
}

export function useTeams(params: UseTeamsParams = {}, options: UseTeamsOptions = {}) {
  const { member_id } = useCommon()
  const { page = 1, limit = 10, search = '', sortBy = '-createdAt', isActive } = params
  const { enabled = true } = options
  
  const buildEndpoint = () => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,    })
    
    if (search) searchParams.append('search', search)
    if (isActive) searchParams.append('isActive', isActive)
    
    return `/teams?${searchParams.toString()}`
  }
    const query = useQuery<{ success: boolean; payload: PaginatedTeams }, ApiError>({
    queryKey: ['teams', member_id || '', page.toString(), limit.toString(), search, sortBy, isActive || ''],
    queryFn: () => api.get<{ success: boolean; payload: PaginatedTeams }>(buildEndpoint(), {
      headers: {
        'x-member-id': member_id
      }
    }),    staleTime: 5 * 60 * 1000,
    enabled: !!member_id && enabled,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  const teams = useMemo(() => {
    return query.data?.payload?.docs || []
  }, [query.data])

  const pagination = useMemo(() => {
    if (!query.data?.payload) return null
    
    const payload = query.data.payload
    return {
      currentPage: payload.page,
      totalPages: payload.totalPages,
      totalItems: payload.totalDocs,
      hasNextPage: payload.hasNextPage,
      hasPrevPage: payload.hasPrevPage,
      itemsPerPage: payload.limit,
    }
  }, [query.data])

  return {
    teams,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateTeam() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Team }, ApiError, CreateTeamData>({
    mutationFn: (data: CreateTeamData) =>
      api.post<{ success: boolean; payload: Team }>('/teams', data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateTeam() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Team }, ApiError, { id: string; data: UpdateTeamData }>({
    mutationFn: ({ id, data }) =>
      api.put<{ success: boolean; payload: Team }>(`/teams/${id}`, data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useToggleTeamActive() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Team }, ApiError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      api.patch<{ success: boolean; payload: Team }>(`/teams/${id}/toggle-active`, { isActive }, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useDeleteTeam() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Team }, ApiError, string>({
    mutationFn: (id: string) =>
      api.patch<{ success: boolean; payload: Team }>(`/teams/${id}/trash`, {}, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export default useTeams
