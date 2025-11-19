'use client'

import { QueryClient } from '@tanstack/react-query'

const isProduction = process.env.NODE_ENV === 'production'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: isProduction ? 5 * 60 * 1000 : 60 * 1000,
        gcTime: isProduction ? 10 * 60 * 1000 : 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.status === 404) return false
          if (error?.status === 401) return false
          if (error?.status === 403) return false
          if (error?.status >= 500) return failureCount < 2
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        refetchOnMount: true,
        networkMode: 'online',
        throwOnError: false,
      },
      mutations: {
        retry: (failureCount, error: any) => {
          if (error?.status === 404) return false
          if (error?.status === 401) return false
          if (error?.status === 403) return false
          if (error?.status >= 500) return failureCount < 1
          return failureCount < 2
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),        
        networkMode: 'online',
        throwOnError: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
