'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { Office, PaginatedOffices, CreateOfficeData, UpdateOfficeData } from '@/types/offices.types'
import useCommon from './use-common'

interface UseOfficesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  isActive?: string
}

export function useOffices(params: UseOfficesParams = {}) {
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
    
    return `/offices?${searchParams.toString()}`
  }
  
  const query = useQuery<{ success: boolean; payload: PaginatedOffices }, ApiError>({
    queryKey: ['offices', member_id || '', page.toString(), limit.toString(), search, sortBy, isActive || ''],
    queryFn: () => api.get<{ success: boolean; payload: PaginatedOffices }>(buildEndpoint(), {
      headers: {
        'x-member-id': member_id
      }
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!member_id,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  const offices = useMemo(() => {
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
    offices,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateOffice() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Office }, ApiError, CreateOfficeData>({
    mutationFn: (data: CreateOfficeData) =>
      api.post<{ success: boolean; payload: Office }>('/offices', data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
    },
  })
}

export function useUpdateOffice() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Office }, ApiError, { id: string; data: UpdateOfficeData }>({
    mutationFn: ({ id, data }) =>
      api.put<{ success: boolean; payload: Office }>(`/offices/${id}`, data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
    },
  })
}

export function useToggleOfficeActive() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Office }, ApiError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      api.patch<{ success: boolean; payload: Office }>(`/offices/${id}/toggle-active`, { isActive }, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
    },
  })
}

export function useDeleteOffice() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Office }, ApiError, string>({
    mutationFn: (id: string) =>
      api.patch<{ success: boolean; payload: Office }>(`/offices/${id}/trash`, {}, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
    },
  })
}
