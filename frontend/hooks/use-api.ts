'use client'

import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api-client'

export type QueryConfig<T> = Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>

export function useApiQuery<T>(
  queryKey: string[],
  endpoint: string,
  config?: QueryConfig<T>
) {
  return useQuery<T, ApiError>({
    queryKey,
    queryFn: () => api.get<T>(endpoint),
    ...config,
  })
}

export function useApiMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  const queryClient = useQueryClient()
  
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      if (error.status === 401) {
        queryClient.clear()
      }
      options?.onError?.(error, variables, context)
    },
    ...options,
  })
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient()
  
  return {
    invalidate: (queryKey: string[]) => queryClient.invalidateQueries({ queryKey }),
    refetch: (queryKey: string[]) => queryClient.refetchQueries({ queryKey }),
    clear: () => queryClient.clear(),
  }
}
