'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { Project, PaginatedProjects, CreateProjectData, UpdateProjectData } from '@/types/projects.types'
import useCommon from './use-common'

interface UseProjectsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  isActive?: string
}

export function useProjects(params: UseProjectsParams = {}) {
  const { member_id } = useCommon()
  const { page = 1, limit = 10, search = '', sortBy = '-createdAt', isActive } = params
  
  const buildEndpoint = () => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    })    
    if (search) searchParams.append('search', search)
    if (isActive) searchParams.append('isActive', isActive)
    
    return `/projects?${searchParams.toString()}`
  }
  
  const query = useQuery<{ success: boolean; payload: PaginatedProjects }, ApiError>({
    queryKey: ['projects', member_id || '', page.toString(), limit.toString(), search, sortBy, isActive || ''],
    queryFn: () => api.get<{ success: boolean; payload: PaginatedProjects }>(buildEndpoint(), {
      headers: {
        'x-member-id': member_id
      }
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!member_id,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  const projects = useMemo(() => {
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
    projects,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateProject() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Project }, ApiError, CreateProjectData>({
    mutationFn: (data: CreateProjectData) =>
      api.post<{ success: boolean; payload: Project }>('/projects', data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Project }, ApiError, { id: string; data: UpdateProjectData }>({
    mutationFn: ({ id, data }) =>
      api.put<{ success: boolean; payload: Project }>(`/projects/${id}`, data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useToggleProjectActive() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Project }, ApiError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      api.put<{ success: boolean; payload: Project }>(`/projects/${id}/toggle-active`, { isActive }, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Project }, ApiError, string>({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean; payload: Project }>(`/projects/${id}`, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
