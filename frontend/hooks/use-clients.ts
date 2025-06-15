'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { Client, PaginatedClients, CreateClientData, UpdateClientData } from '@/types/clients.types'
import useCommon from './use-common'

interface UseClientsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export function useClients(params: UseClientsParams = {}) {
  const { member_id } = useCommon()
  const { page = 1, limit = 10, search = '', sortBy = '-createdAt' } = params
  
  const buildEndpoint = () => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    })    
    if (search) searchParams.append('search', search)
    
    return `/clients?${searchParams.toString()}`
  }
  
  const query = useQuery<{ success: boolean; payload: PaginatedClients }, ApiError>({
    queryKey: ['clients', member_id || '', page.toString(), limit.toString(), search, sortBy],
    queryFn: () => api.get<{ success: boolean; payload: PaginatedClients }>(buildEndpoint(), {
      headers: {
        'x-member-id': member_id
      }
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!member_id,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  })

  const clients = useMemo(() => {
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
    clients,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateClient() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Client }, ApiError, CreateClientData>({
    mutationFn: (data: CreateClientData) =>
      api.post<{ success: boolean; payload: Client }>('/clients', data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateClient() {
  const { member_id } = useCommon()
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; payload: Client }, ApiError, { id: string; data: UpdateClientData }>({
    mutationFn: ({ id, data }) =>
      api.put<{ success: boolean; payload: Client }>(`/clients/${id}`, data, {
        headers: {
          'x-member-id': member_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
