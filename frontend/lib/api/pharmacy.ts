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
        body: JSON.stringify(data),
    });
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiFetch<ApiResponse<DashboardStats>>('/pharmacy/dashboard/stats');
}

export async function getPharmacyProfile(): Promise<ApiResponse<PharmacyProfile>> {
    return apiFetch<ApiResponse<PharmacyProfile>>('/pharmacy/profile');
}

export async function getInventory(page: number = 1): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> {
    return apiFetch<ApiResponse<PaginatedResponse<InventoryItem>>>(`/pharmacy/inventory?page=${page}`);
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

    // Manual fetch still needed for FormData, but we can use a helper or just get token here
    // However, since we refactored config.ts, it's better to keep it clean.
    // I'll leave the manual token here for NOW as it uses fetch() directly with FormData, 
    // unless I refactor apiFetch to support FormData.
    const getAuthToken = () => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : null;
    };

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
        body: JSON.stringify(data),
    });
}

export async function deleteInventoryItem(id: number): Promise<ApiResponse<unknown>> {
    return apiFetch<ApiResponse<unknown>>(`/pharmacy/inventory/${id}`, {
        method: 'DELETE',
    });
}

/**
 * Upload inventory CSV file for bulk updates
 * Accepts CSV or TXT files with medicine data
 */
export async function uploadInventoryCSV(file: File): Promise<ApiResponse<unknown>> {
    const formData = new FormData();
    formData.append('file', file);

    const getAuthToken = () => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : null;
    };

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
            resData.message || 'An error occurred during CSV upload',
            response.status,
            resData.errors || null
        );
    }

    return resData;
}

/**
 * Export inventory as CSV file
 * Downloads the pharmacy's current inventory data
 */
export async function exportInventoryCSV(): Promise<void> {
    const getAuthToken = () => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : null;
    };

    const token = getAuthToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}/pharmacy/inventory/export`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        const resData = await response.json();
        throw new ApiError(
            resData.message || 'Export failed',
            response.status,
            resData.errors || null
        );
    }

    // Get the filename from the Content-Disposition header or use a default
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : `inventory_${new Date().toISOString().split('T')[0]}.csv`;

    // Create a blob from the response and trigger download
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
