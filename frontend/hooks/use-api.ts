'use client'

import { 
  useMutation, 
  useQuery, 
  useInfiniteQuery,
  useQueryClient, 
  UseQueryOptions, 
  UseMutationOptions,
  UseInfiniteQueryOptions,
  InfiniteData
} from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import useCommon from './use-common'

export type QueryConfig<T> = Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
export type InfiniteQueryConfig<T> = Omit<UseInfiniteQueryOptions<T, ApiError, InfiniteData<T, unknown>>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>

export function useApiQuery<T>(
  queryKey: string[],
  endpoint: string,
  config?: QueryConfig<T>
) {
  const { member_id } = useCommon()
  
  return useQuery<T, ApiError>({
    queryKey,
    queryFn: () => api.get<T>(endpoint, {
      headers: {
        'X-Member-ID': member_id,
      },
    }),
    ...config,
  })
}

export function useApiInfiniteQuery<T>(
  queryKey: string[],
  getEndpoint: (page: number) => string,
  getNextPageParam: (lastPage: T, allPages: T[]) => any,
  config?: InfiniteQueryConfig<T>
) {
  const { member_id } = useCommon()
  
  return useInfiniteQuery<T, ApiError>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      return api.get<T>(getEndpoint(pageParam as number), {
        headers: {
          'X-Member-ID': member_id,
        },
      })
    },
    getNextPageParam,
    initialPageParam: 1,
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
