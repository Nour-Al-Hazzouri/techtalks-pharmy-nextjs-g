/**
 * API Type Definitions
 * Matches the Laravel backend response format
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
    errors: Record<string, string[]> | null;
}

/**
 * User object from API
 */
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'pharmacist' | 'admin';
    phone: string | null;
}

/**
 * Register request body
 * Note: Backend uses 'user'/'pharmacist', not 'patient'/'pharmacy'
 */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    role?: 'user' | 'pharmacist';
}

/**
 * Login response with token
 */
export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}
