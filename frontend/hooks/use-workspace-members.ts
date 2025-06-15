'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { PaginatedWorkspaceMembers } from '@/types/workspace.types'
import useCommon from './use-common'

interface UseWorkspaceMembersParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  permission?: string
}

export function useWorkspaceMembers(params: UseWorkspaceMembersParams = {}) {
  const { member_id } = useCommon()
  const { page = 1, limit = 10, search = '', status, permission } = params
    const buildEndpoint = () => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })    
    if (search) searchParams.append('search', search)
    if (status && status !== 'all') searchParams.append('status', status)
    if (permission && permission !== 'all') searchParams.append('permission', permission)
    
    return `/workspace-members/workspace/all?${searchParams.toString()}`
  }
  
  const query = useQuery<{ success: boolean; payload: PaginatedWorkspaceMembers }, ApiError>({
    queryKey: ['workspace-members', member_id || '', page.toString(), limit.toString(), search, status || '', permission || ''],
    queryFn: () => api.get<{ success: boolean; payload: PaginatedWorkspaceMembers }>(buildEndpoint(), {
      headers: {
        'x-member-id': member_id
      }
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!member_id,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  const members = useMemo(() => {
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
    members,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
