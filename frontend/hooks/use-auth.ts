'use client'

import { useApiQuery, useApiMutation, useInvalidateQueries } from '@/hooks/use-api'
import { api } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

export interface User {
  id: string
  email: string
  timezone: string
  lastLoginAt?: string
  isEmailVerified: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  timezone?: string
}

export interface VerifyEmailData {
  email: string
  otp: string
}

export function useCurrentUser() {
  return useApiQuery<{ user: User }>(
    queryKeys.authUser(),
    '/auth/me',
    {
      staleTime: 15 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error?.status === 401) return false
        return failureCount < 2
      },
    }
  )
}

export function useLogin() {
  const { invalidate } = useInvalidateQueries()
  
  return useApiMutation<{ user: User }, LoginData>(
    (data) => api.post<{ user: User }>('/auth/login', data),
    {
      onSuccess: () => {
        invalidate(queryKeys.authUser())
      },
    }
  )
}

export function useRegister() {
  return useApiMutation<{ user: User }, RegisterData>(
    (data) => api.post<{ user: User }>('/auth/register', data)
  )
}

export function useVerifyEmail() {
  const { invalidate } = useInvalidateQueries()
  
  return useApiMutation<{ user: User }, VerifyEmailData>(
    (data) => api.post<{ user: User }>('/auth/verify-email', data),
    {
      onSuccess: () => {
        invalidate(queryKeys.authUser())
      },
    }
  )
}

export function useLogout() {
  const { clear } = useInvalidateQueries()
  
  return useApiMutation<void, void>(
    () => api.post('/auth/logout'),
    {
      onSuccess: () => {
        clear()
      },
    }
  )
}

export function useRefreshToken() {
  const { invalidate } = useInvalidateQueries()
  
  return useApiMutation<{ user: User }, void>(
    () => api.post<{ user: User }>('/auth/refresh-token'),
    {
      onSuccess: () => {
        invalidate(queryKeys.authUser())
      },
    }
  )
}
