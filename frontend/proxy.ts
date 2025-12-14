import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Get the auth token from cookies
    const token = request.cookies.get('auth_token')?.value

    const { pathname } = request.nextUrl

    // Define public paths that don't require authentication
    // We explicitly include login and register
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

    // Logic:
    // 1. If user is on an auth page (login/register) AND has a token -> Redirect to Home
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. If user is NOT on an auth page AND has NO token -> Redirect to Login
    // We exclude checking for static files/images by matcher config, but we can double check here 
    // ensuring we don't block access to public assets if matcher misses something.
    if (!isAuthPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Configure which paths the proxy runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - icons (public folder icons)
         * - images (public folder images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)',
    ],
}
