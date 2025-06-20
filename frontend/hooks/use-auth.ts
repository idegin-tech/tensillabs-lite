'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'

export interface AuthUser {
    id: string
    email: string
    timezone: string
    isEmailVerified: boolean
    lastLoginAt?: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    password: string
    confirmPassword: string
    timezone: string
}

interface AuthResponse {
    success: boolean
    message: string
    payload: {
        user: AuthUser
    }
}

export function useAuth() {
    const { data, isLoading, error } = useQuery<AuthResponse, ApiError>({
        queryKey: ['auth', 'me'],
        queryFn: () => api.get('/auth/me'),
        retry: (failureCount, error: ApiError) => {
            if (error?.status === 401) return false
            return failureCount < 3
        },
        staleTime: 5 * 60 * 1000,
    })

    const user = data?.payload?.user || null
    const isAuthenticated = !!user && !error

    return {
        user,
        isLoading,
        isAuthenticated,
        error,
    }
}

export function useAuthActions() {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const queryClient = useQueryClient()

    const loginMutation = useMutation<AuthResponse, ApiError, LoginCredentials>({
        mutationFn: (credentials: LoginCredentials) =>
            api.post<AuthResponse>('/auth/login', credentials),
        onSuccess: (response) => {
            queryClient.setQueryData(['auth', 'me'], response)
            queryClient.invalidateQueries({ queryKey: ['auth'] })
            queryClient.invalidateQueries({ queryKey: ['workspace-memberships'] })
            router.push('/workspaces')
            setError(null)
        },
        onError: (error: ApiError) => {
            const errorMessage = error.message || 'Login failed'
            setError(errorMessage)
        },
    })

    const registerMutation = useMutation<AuthResponse, ApiError, RegisterCredentials>({
        mutationFn: (credentials: RegisterCredentials) =>
            api.post<AuthResponse>('/auth/register', credentials),
        onSuccess: (response) => {
            queryClient.setQueryData(['auth', 'me'], response)
            queryClient.invalidateQueries({ queryKey: ['auth'] })
            queryClient.invalidateQueries({ queryKey: ['workspace-memberships'] })
            router.push('/')
            setError(null)
        },
        onError: (error: ApiError) => {
            const errorMessage = error.message || 'Registration failed'
            setError(errorMessage)
        },
    })

    const logoutMutation = useMutation<any, ApiError, void>({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'me'], null)
            queryClient.removeQueries({ queryKey: ['auth'] })
            queryClient.removeQueries({ queryKey: ['workspace-memberships'] })
            router.push('/')
            setError(null)
        },
        onError: (error: ApiError) => {
            setError(error.message || 'Logout failed')
        },
    })

    const login = async (credentials: LoginCredentials) => {
        setError(null)
        try {
            await loginMutation.mutateAsync(credentials)
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || 'Login failed' }
        }
    }

    const register = async (credentials: RegisterCredentials) => {
        setError(null)
        try {
            await registerMutation.mutateAsync(credentials)
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || 'Registration failed' }
        }
    }

    const logout = async () => {
        setError(null)
        return logoutMutation.mutateAsync()
    }

    const clearError = () => setError(null)

    return {
        login,
        register,
        logout,
        isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
        error,
        clearError,
    }
}
