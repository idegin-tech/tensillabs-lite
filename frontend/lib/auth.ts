import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { APP_CONFIG } from '@/config/app.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                console.log('[NEXTAUTH] Authorize function called')
                console.log('[NEXTAUTH] Credentials received:', { 
                    email: credentials?.email,
                    hasPassword: !!credentials?.password 
                })

                if (!credentials?.email || !credentials?.password) {
                    console.log('[NEXTAUTH] Missing credentials')
                    return null
                }

                try {
                    const loginUrl = `${APP_CONFIG.apiUrl}/auth/login`
                    console.log('[NEXTAUTH] Making request to:', loginUrl)
                    console.log('[NEXTAUTH] APP_CONFIG.apiUrl:', APP_CONFIG.apiUrl)
                    
                    const response = await fetch(loginUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        credentials: 'include',
                    })

                    console.log('[NEXTAUTH] Backend response status:', response.status)
                    console.log('[NEXTAUTH] Backend response ok:', response.ok)

                    if (!response.ok) {
                        const errorText = await response.text()
                        console.log('[NEXTAUTH] Backend error response:', errorText)
                        return null
                    }

                    const data = await response.json()
                    console.log('[NEXTAUTH] Backend success response:', {
                        success: data.success,
                        hasUser: !!data.payload?.user,
                        userEmail: data.payload?.user?.email
                    })

                    if (data.success && data.payload?.user) {
                        const user = {
                            id: data.payload.user.id,
                            email: data.payload.user.email,
                            timezone: data.payload.user.timezone,
                            isEmailVerified: data.payload.user.isEmailVerified,
                        }
                        console.log('[NEXTAUTH] Returning user object:', user)
                        return user
                    }

                    console.log('[NEXTAUTH] Invalid response structure')
                    return null
                } catch (error) {
                    console.error('[NEXTAUTH] Auth error:', error)
                    return null
                }
            }
        })
    ],

    session: {
        strategy: 'jwt',
        maxAge: 5 * 24 * 60 * 60,
        updateAge: 10 * 60,
    },

    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                domain: process.env.NODE_ENV === 'production' 
                    ? process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '').split('/')[0]
                    : undefined,
                maxAge: 5 * 24 * 60 * 60,
            },
        },
        csrfToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
        callbackUrl: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
            options: {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
    },

    useSecureCookies: process.env.NODE_ENV === 'production',

    pages: {
        signIn: '/',
        error: '/',
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user && account) {
                token.id = user.id
                token.email = user.email
                token.timezone = user.timezone
                token.isEmailVerified = user.isEmailVerified
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.timezone = token.timezone as string
                session.user.isEmailVerified = token.isEmailVerified as boolean
            }
            return session
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return `${baseUrl}/workspaces`
        },
    },
    events: {
        async signOut() {
            try {
                await fetch(`${APP_CONFIG.apiUrl}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                })
            } catch (error) {
                console.error('Error during logout:', error)
            }
        },
    },
})
