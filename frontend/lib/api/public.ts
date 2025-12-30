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
    pivot?: {
        quantity: number;
        price: number;
        available: boolean;
    };
}

export interface SearchedMedicine {
    id: number;
    name: string;
    generic_name: string;
    category: string;
    description: string;
    pharmacies: PublicPharmacy[];
}

export interface GeocodeResult {
    place_id: number | string | null;
    display_name: string | null;
    lat: string | null;
    lon: string | null;
    type: string | null;
}

/**
 * Get pharmacies list
 */
export async function getPharmacies(params?: { verified?: '0' | '1', status?: string }): Promise<ApiResponse<PaginatedResponse<PublicPharmacy>>> {
    const searchParams = new URLSearchParams()
    if (params?.verified) searchParams.append('verified', params.verified)
    if (params?.status) searchParams.append('status', params.status)
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return apiFetch<ApiResponse<PaginatedResponse<PublicPharmacy>>>(`/pharmacies${query}`);
}

/**
 * Search medicines
 * Returns medicines with pharmacies that have them
 */
export async function searchMedicines(query: string): Promise<ApiResponse<SearchedMedicine[]>> {
    return apiFetch<ApiResponse<SearchedMedicine[]>>(`/medicines/search?name=${encodeURIComponent(query)}`);
}

export async function autocompleteMedicines(query: string): Promise<ApiResponse<Record<string, { name: string, category: string }[]>>> {
    return apiFetch<ApiResponse<Record<string, { name: string, category: string }[]>>>(`/medicines/autocomplete?query=${encodeURIComponent(query)}`);
}

export async function findNearestPharmaciesWithMedicine(params: { name: string; lat: number; lng: number }): Promise<ApiResponse<PublicPharmacy[]>> {
    const qs = new URLSearchParams({
        name: params.name,
        lat: String(params.lat),
        lng: String(params.lng),
    })

    return apiFetch<ApiResponse<PublicPharmacy[]>>(`/medicines/nearest?${qs.toString()}`);
}

export async function geocodeSearch(query: string): Promise<ApiResponse<GeocodeResult[]>> {
    return apiFetch<ApiResponse<GeocodeResult[]>>(`/geocode/search?q=${encodeURIComponent(query)}`);
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
