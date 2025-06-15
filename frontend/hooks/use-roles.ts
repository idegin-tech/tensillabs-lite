'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { Role, PaginatedRoles, CreateRoleData, UpdateRoleData } from '@/types/roles.types'
import useCommon from './use-common'

interface UseRolesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export function useRoles(params: UseRolesParams = {}) {
  const { member_id } = useCommon()
  const { page = 1, limit = 10, search = '', sortBy = '-createdAt' } = params
  
  const buildEndpoint = () => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    })    
    if (search) searchParams.append('search', search)
    
    return `/roles?${searchParams.toString()}`
  }
  
  const query = useQuery<{ success: boolean; payload: PaginatedRoles }, ApiError>({
    queryKey: ['roles', member_id || '', page.toString(), limit.toString(), search, sortBy],
    queryFn: () => api.get<{ success: boolean; payload: PaginatedRoles }>(buildEndpoint(), {
      headers: {
        'x-member-id': member_id
      }
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!member_id,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  const roles = useMemo(() => {
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
    roles,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateRole() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Role }, ApiError, CreateRoleData>({
    mutationFn: (data: CreateRoleData) =>
      api.post<{ success: boolean; payload: Role }>('/roles', data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

export function useUpdateRole() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Role }, ApiError, { id: string; data: UpdateRoleData }>({
    mutationFn: ({ id, data }) =>
      api.put<{ success: boolean; payload: Role }>(`/roles/${id}`, data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

export function useToggleRoleActive() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Role }, ApiError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      api.patch<{ success: boolean; payload: Role }>(`/roles/${id}/toggle-active`, { isActive }, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

export default useRoles
