import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const unlocked = request.cookies.get('unlocked')?.value || 'false';
  const pathname = request.nextUrl.pathname

  // Always allow access to "/" and "/lock"
  if (pathname === '/' || pathname === '/lock') {
    return NextResponse.next()
  }

  // If user is unlocked, allow access
  if (unlocked === 'true') {
    return NextResponse.next()
  }

  // Otherwise redirect to /lock
  const url = request.nextUrl.clone()
  url.pathname = '/lock'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'], // Apply middleware to all routes except static, API
}
