import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy Function
 * Handles authentication and role-based access control
 */
export function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const userRole = request.cookies.get('user_role')?.value
    const { pathname } = request.nextUrl

    // Public paths that don't require authentication
    const publicPaths = ['/login', '/register']
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // Pharmacy-only routes
    const pharmacyRoutes = ['/dashboard', '/inventory', '/bulk-upload', '/verification', '/profile']
    const isPharmacyRoute = pharmacyRoutes.some(route => pathname.startsWith(route))

    // If on a public path (login/register)
    if (isPublicPath) {
        // If already authenticated, redirect to appropriate page
        if (token) {
            if (userRole === 'pharmacist') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    // Not authenticated - redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Pharmacy routes - only pharmacy users can access
    if (isPharmacyRoute) {
        if (userRole !== 'pharmacist') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Regular users trying to access patient-only routes (/, /map, etc.)
    // Pharmacy users shouldn't access patient pages
    if (!isPharmacyRoute && userRole === 'pharmacist') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)',
    ],
}
