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
    verification_status: 'incomplete' | 'pending' | 'verified' | 'rejected';
    rejection_reason?: string | null;
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
 * Upload a pharmacy document
 */
export async function uploadPharmacyDocument(docType: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('file', file);

    const match = document.cookie.match(/auth_token=([^;]+)/);
    const token = match ? match[1] : null;

    const response = await fetch(`${API_BASE_URL}/pharmacy/documents`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new ApiError(data.message || 'Upload failed', response.status);
    }
    return data;
}

/**
 * Get pharmacy documents
 */
export async function getMyDocuments(): Promise<ApiResponse<any[]>> {
    return apiFetch<ApiResponse<any[]>>('/pharmacy/documents');
}

/**
 * Delete a pharmacy document
 */
export async function deletePharmacyDocument(id: number | string): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>(`/pharmacy/documents/${id}`, {
        method: 'DELETE'
    });
}

/**
 * Submit pharmacy for verification
 */
export async function submitForVerification(): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>('/pharmacy/submit-verification', {
        method: 'POST'
    });
}

/**
 * Cancel pharmacy verification submission
 */
export async function cancelVerificationSubmission(): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>('/pharmacy/cancel-verification', {
        method: 'POST'
    });
}
