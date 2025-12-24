/**
 * Pharmacy API Service
 * Handles pharmacy-related API calls (pharmacist role)
 */

import { apiFetch, ApiError } from './config';
import { ApiResponse } from './types';

/**
 * Dashboard statistics from API
 */
export interface DashboardStats {
    total_medicines: number;
    total_available: number;
    low_stock_count: number;
    out_of_stock: number;
    total_reports: number;
    average_rating: number | null;
}

/**
 * Pharmacy profile from API
 */
export interface PharmacyProfile {
    id: number;
    name: string;
    address: string;
    phone: string;
    verified: boolean | null;
    license_number: string;
    latitude: string;
    longitude: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    rating: string | null;
}

/**
 * Inventory item from API
 */
export interface InventoryItem {
    id: number;
    medicine_id: number;
    medicine_name: string;
    quantity: number;
    price: string;
    available: boolean;
    expires_at: string | null;
    updated_at: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

/**
 * Get auth token from cookies
 */
function getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
}

/**
 * Create headers with auth token
 */
function authHeaders(): HeadersInit {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Register a new pharmacy
 */
export async function registerPharmacy(data: {
    name: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    license_number: string;
}): Promise<ApiResponse<PharmacyProfile>> {
    return apiFetch<ApiResponse<PharmacyProfile>>('/pharmacy/register', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
}

/**
 * Get pharmacy dashboard stats
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiFetch<ApiResponse<DashboardStats>>('/pharmacy/dashboard/stats', {
        headers: authHeaders(),
    });
}

/**
 * Get pharmacy profile
 */
export async function getPharmacyProfile(): Promise<ApiResponse<PharmacyProfile>> {
    return apiFetch<ApiResponse<PharmacyProfile>>('/pharmacy/profile', {
        headers: authHeaders(),
    });
}

/**
 * Get pharmacy inventory
 */
export async function getInventory(page: number = 1): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> {
    return apiFetch<ApiResponse<PaginatedResponse<InventoryItem>>>(`/pharmacy/inventory?page=${page}`, {
        headers: authHeaders(),
    });
}

/**
 * Add item to inventory
 */
export async function addInventoryItem(data: {
    name: string;
    quantity: number;
    price: number;
    expires_at?: string;
}): Promise<ApiResponse<unknown>> {
    return apiFetch<ApiResponse<unknown>>('/pharmacy/inventory', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
}

/**
 * Update inventory item
 */
export async function updateInventoryItem(id: number, data: {
    quantity?: number;
    price?: number;
    available?: boolean;
}): Promise<ApiResponse<unknown>> {
    return apiFetch<ApiResponse<unknown>>(`/pharmacy/inventory/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
}

/**
 * Delete inventory item
 */
export async function deleteInventoryItem(id: number): Promise<ApiResponse<unknown>> {
    return apiFetch<ApiResponse<unknown>>(`/pharmacy/inventory/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}
