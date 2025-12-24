/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { apiFetch } from './config';
import { ApiResponse, User, RegisterRequest } from './types';

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
