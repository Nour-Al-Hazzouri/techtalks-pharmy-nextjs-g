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

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(
            data.message || 'An error occurred',
            response.status,
            data.errors || null
        );
    }

    return data;
}
