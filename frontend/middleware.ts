import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (pathname.startsWith('/workspaces') || pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (pathname === '/' && isLoggedIn) {
    return NextResponse.redirect(new URL('/workspaces', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/workspaces/:path*',
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
