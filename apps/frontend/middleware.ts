import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/workspaces') || pathname.startsWith('/dashboard')) {
    const hasAuthCookie = req.cookies.get('connect.sid')
    
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (pathname === '/' && req.cookies.get('connect.sid')) {
    return NextResponse.redirect(new URL('/workspaces', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/workspaces/:path*',
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
