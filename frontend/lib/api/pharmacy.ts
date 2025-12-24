/**
 * Pharmacy API Service
 * Handles pharmacy-related API calls (pharmacist role)
 */

import { apiFetch, ApiError, API_BASE_URL } from './config';
import { ApiResponse } from './types';

export interface DashboardStats {
    total_medicines: number;
    total_available: number;
    low_stock_count: number;
    out_of_stock: number;
    total_reports: number;
    average_rating: number | null;
}

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

function getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
}

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

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiFetch<ApiResponse<DashboardStats>>('/pharmacy/dashboard/stats', {
        headers: authHeaders(),
    });
}

export async function getPharmacyProfile(): Promise<ApiResponse<PharmacyProfile>> {
    return apiFetch<ApiResponse<PharmacyProfile>>('/pharmacy/profile', {
        headers: authHeaders(),
    });
}

export async function getInventory(page: number = 1): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> {
    return apiFetch<ApiResponse<PaginatedResponse<InventoryItem>>>(`/pharmacy/inventory?page=${page}`, {
        headers: authHeaders(),
    });
}

/**
 * Add item to inventory
 * Uses CSV upload endpoint to handle "find or create" medicine logic by name
 */
export async function addInventoryItem(data: {
    name: string;
    quantity: number;
    price: number;
    expires_at?: string;
}): Promise<ApiResponse<unknown>> {
    // Construct a single-item CSV
    const header = "medicine_name,quantity,price";
    const safeName = data.name.includes(',') ? `"${data.name}"` : data.name;
    const row = `${safeName},${data.quantity},${data.price}`;
    const csvContent = `${header}\n${row}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const file = new File([blob], 'single_add.csv', { type: 'text/csv' });

    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}/pharmacy/inventory/upload`, {
        method: 'POST',
        headers: headers,
        body: formData
    });

    const resData = await response.json();

    if (!response.ok) {
        throw new ApiError(
            resData.message || 'An error occurred during add',
            response.status,
            resData.errors || null
        );
    }

    return resData;
}

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

export async function deleteInventoryItem(id: number): Promise<ApiResponse<unknown>> {
    return apiFetch<ApiResponse<unknown>>(`/pharmacy/inventory/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}
