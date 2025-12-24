/**
 * Public API Service
 * Handles public API calls (no auth required)
 */

import { apiFetch } from './config';
import { ApiResponse } from './types';
import { PaginatedResponse } from './pharmacy';

export interface PublicPharmacy {
    id: number;
    name: string;
    address: string;
    phone: string;
    verified: boolean;
    license_number: string;
    latitude: string;
    longitude: string;
    verification_status: string;
    rating: string | null;
    total_reports: number;
    distance?: string;
}

export interface SearchedMedicine {
    id: number;
    name: string;
    generic_name: string;
    category: string;
    description: string;
    pharmacies: PublicPharmacy[];
}

/**
 * Get pharmacies list
 */
export async function getPharmacies(params?: { verified?: '0' | '1' }): Promise<ApiResponse<PaginatedResponse<PublicPharmacy>>> {
    const query = params ? `?verified=${params.verified}` : '';
    return apiFetch<ApiResponse<PaginatedResponse<PublicPharmacy>>>(`/pharmacies${query}`);
}

/**
 * Search medicines
 * Returns medicines with pharmacies that have them
 */
export async function searchMedicines(query: string): Promise<ApiResponse<SearchedMedicine[]>> {
    return apiFetch<ApiResponse<SearchedMedicine[]>>(`/medicines/search?name=${encodeURIComponent(query)}`);
}

/**
 * Submit report for a pharmacy
 */
export async function submitReport(data: { pharmacy_id: number | string, report_type: string, reason?: string }): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>('/reports', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
