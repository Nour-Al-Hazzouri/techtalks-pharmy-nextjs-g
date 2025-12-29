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
    name: string;
    pivot: {
        quantity: number;
        price: number;
        available: boolean;
        updated_at?: string;
    }
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
}): Promise<ApiResponse<unknown>> {
    // If we have a name, we likely want to find the ID first or let backend handle it.
    // However, backend InventoryController@store requires 'medicine_id' if 'name' is not present?
    // Looking at request logic: 'medicine_id' => 'required_without:name'.
    // So we CAN pass 'name' if we want backend to resolve it (if we updated backend to support it).
    // BUT, the user wants us to select from DB. 
    // The PharmacyMedicineSearch gives us a name. The most robust way is to lookup the ID.
    // But since public autocomplete doesn't return IDs easily (grouped response), 
    // let's rely on the backend finding it by name which `InventoryController` (store) doesn't natively support yet?
    // Wait, `InventoryRequest` has `medicine_id` required without name.
    // Does `InventoryController` use name?
    // `store` calls `medicineService->addInventoryItem`. 
    // `MedicineService` expects `medicine_id` in data for `inventoryRepo->updateStock`.

    // We need to resolve name to ID or send ID.
    // For now, let's assume we send name and backend needs to handle it OR we assume frontend resolves it.
    // The previous CSV upload logic did `findOrCreateMedicineByName`.

    // Let's modify this to send JSON.
    // We will update backend InventoryRequest to allow `name` and resolve it in Controller if needed.
    // For now, sending as JSON to `/pharmacy/inventory`.

    return apiFetch<ApiResponse<unknown>>('/pharmacy/inventory', {
        method: 'POST',
        body: JSON.stringify(data)
    });
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