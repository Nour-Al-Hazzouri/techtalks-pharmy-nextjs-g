import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy Function
 * 
 * For now, this is a pass-through proxy. Authentication will be
 * handled entirely in the components using a session context.
 * 
 * Role-based access control will be enforced when backend is connected.
 */
export function proxy(request: NextRequest) {
    // Pass through all requests - auth is handled by session context
    return NextResponse.next()
}

// Configure which paths the proxy runs on
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)',
    ],
}
