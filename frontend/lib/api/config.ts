/**
 * API Configuration
 * Base URL and reusable fetch wrapper for API calls
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    status: number;
    errors: Record<string, string[]> | null;

    constructor(message: string, status: number, errors: Record<string, string[]> | null = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

/**
 * Helper to get authentication token from cookies (browser-only)
 */
function getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
}

/**
 * Reusable fetch wrapper with error handling
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const token = getAuthToken();
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            cache: options.cache ?? 'no-store',
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Network request failed';
        throw new ApiError(`Network error: ${message}`, 0, null);
    }

    const rawText = await response.text();
    const data = rawText ? (() => {
        try {
            return JSON.parse(rawText);
        } catch {
            return null;
        }
    })() : null;

    if (response.status === 401) {
        // Only force-logout if the request was authenticated (token exists).
        // This prevents failed login attempts from refreshing the page and clearing form inputs.
        if (typeof document !== 'undefined' && token) {
            document.cookie = "auth_token=; path=/; max-age=0";
            document.cookie = "user_role=; path=/; max-age=0";
            window.location.href = '/login';
        }
    }

    if (!response.ok) {
        const message =
            (data && typeof data === 'object' && 'message' in data && typeof (data as any).message === 'string'
                ? (data as any).message
                : response.statusText || 'Request failed');

        const errors =
            (data && typeof data === 'object' && 'errors' in data
                ? ((data as any).errors ?? null)
                : null);

        throw new ApiError(message || 'An error occurred', response.status, errors);
    }

    if (response.status !== 204 && data === null) {
        throw new ApiError('Invalid server response. Please try again.', response.status, null);
    }

    return data;
}
