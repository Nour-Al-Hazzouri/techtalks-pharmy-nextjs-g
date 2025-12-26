import { apiFetch } from './config';
import { ApiResponse } from './types';
import { PaginatedResponse } from './pharmacy';
import { PublicPharmacy } from './public';

export interface AdminReport {
    id: number;
    pharmacy_id: number;
    user_id: number;
    report_type: string;
    reason: string | null;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
    updated_at: string;
    pharmacy?: PublicPharmacy;
    user?: {
        name: string;
        email: string;
    };
}

/**
 * Get all reports (Admin only)
 */
export async function getAdminReports(page = 1): Promise<ApiResponse<PaginatedResponse<AdminReport>>> {
    return apiFetch<ApiResponse<PaginatedResponse<AdminReport>>>(`/admin/reports?page=${page}`);
}

/**
 * Update report status
 */
export async function updateReportStatus(id: number | string, status: string, notes?: string): Promise<ApiResponse<AdminReport>> {
    return apiFetch<ApiResponse<AdminReport>>(`/admin/reports/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes })
    });
}

/**
 * Approve pharmacy
 */
export async function approvePharmacy(id: number | string): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>(`/admin/pharmacies/${id}/approve`, {
        method: 'PUT'
    });
}

/**
 * Reject pharmacy
 */
export async function rejectPharmacy(id: number | string, reason: string): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>(`/admin/pharmacies/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
    });
}
