/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { apiFetch } from './config';
import { ApiResponse, User, RegisterRequest, LoginResponse } from './types';

/**
 * Register a new user
 * @param data - Registration data with password confirmation
 * @returns API response with user data
 */
export async function register(data: RegisterRequest): Promise<ApiResponse<User>> {
    return apiFetch<ApiResponse<User>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Login user
 * @param email - User email
 * @param password - User password
 * @returns API response with token and user data
 */
export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return apiFetch<ApiResponse<LoginResponse>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse<unknown>> {
    return apiFetch<ApiResponse<unknown>>('/auth/logout', {
        method: 'POST',
    });
}
