import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/_next', '/favicon.ico', '/api'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for Firebase session cookie
  const sessionCookie = request.cookies.get('alogyan-session')?.value;

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/students/:path*',
    '/batches/:path*',
    '/attendance/:path*',
    '/fees/:path*',
    '/notes/:path*',
    '/tests/:path*',
    '/reports/:path*',
    '/announcements/:path*'
  ],
};