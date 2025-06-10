'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface AuthUser {
  id: string
  email: string
  timezone: string
  isEmailVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user: AuthUser | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    timezone: session.user.timezone,
    isEmailVerified: session.user.isEmailVerified,
  } : null

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated' && !!user

  return {
    user,
    isLoading,
    isAuthenticated,
    status,
  }
}

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  
  const login = async (credentials: LoginCredentials) => {
    console.log('[FRONTEND] Login attempt started for:', credentials.email)
    setIsLoading(true)
    setError(null)

    try {
      console.log('[FRONTEND] Calling NextAuth signIn with credentials...')
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      console.log('[FRONTEND] NextAuth signIn result:', {
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url
      })

      if (result?.error) {
        console.log('[FRONTEND] Login failed with error:', result.error)
        setError('Invalid credentials')
        return { success: false, error: 'Invalid credentials' }
      }

      if (result?.ok) {
        console.log('[FRONTEND] Login successful, redirecting to /workspaces')
        router.push('/workspaces')
        return { success: true }
      }

      console.log('[FRONTEND] Unexpected login result - no error but not ok')
      setError('An unexpected error occurred')
      return { success: false, error: 'An unexpected error occurred' }
    } catch (error) {
      console.error('[FRONTEND] Login error caught:', error)
      const message = 'Network error. Please try again.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
      console.log('[FRONTEND] Login attempt completed')
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    logout,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
