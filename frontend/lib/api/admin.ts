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

/**
 * Reject pharmacy
 */
export async function rejectPharmacy(id: number | string, reason: string): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>(`/admin/pharmacies/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
    });
}

// --- Medicines ---

export interface Medicine {
    id: number;
    name: string;
    generic_name?: string;
    category?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export async function getMedicines(page = 1, search = ""): Promise<ApiResponse<PaginatedResponse<Medicine>>> {
    const query = search ? `&search=${encodeURIComponent(search)}` : "";
    return apiFetch<ApiResponse<PaginatedResponse<Medicine>>>(`/admin/medicines?page=${page}${query}`);
}

export async function createMedicine(data: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    return apiFetch<ApiResponse<Medicine>>('/admin/medicines', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function updateMedicine(id: number, data: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    return apiFetch<ApiResponse<Medicine>>(`/admin/medicines/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

export async function deleteMedicine(id: number): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>(`/admin/medicines/${id}`, {
        method: 'DELETE'
    });
}

// --- Admin Dashboard ---

export interface AdminPharmacy {
    id: number;
    name: string;
    address: string;
    phone: string;
    license_number: string;
    verification_status: 'incomplete' | 'pending' | 'verified' | 'rejected';
    created_at: string;
    updated_at: string;
    documents?: any[];
}

/**
 * Get pharmacies for admin (with optional status filter)
 */
export async function getAdminPharmacies(status?: string): Promise<ApiResponse<PaginatedResponse<AdminPharmacy>>> {
    const query = status ? `?status=${status}` : '';
    return apiFetch<ApiResponse<PaginatedResponse<AdminPharmacy>>>(`/admin/pharmacies${query}`);
}

/**
 * Get admin dashboard stats by aggregating multiple endpoints
 */
export async function getAdminDashboardStats(): Promise<{
    pendingVerifications: number;
    verifiedPharmacies: number;
    rejected: number;
    totalMedicines: number;
}> {
<<<<<<< HEAD
    const [pendingRes, verifiedRes, rejectedRes, medicinesRes] = await Promise.all([
        getAdminPharmacies('pending'),
        getAdminPharmacies('verified'),
        getAdminPharmacies('rejected'),
        apiFetch<ApiResponse<PaginatedResponse<Medicine>>>('/admin/medicines?page=1'),
    ]);

    const pending = pendingRes.data?.meta?.total || 0;
    const verified = verifiedRes.data?.meta?.total || 0;
    const rejected = rejectedRes.data?.meta?.total || 0;
=======
    const [pharmaciesRes, medicinesRes] = await Promise.all([
        apiFetch<ApiResponse<PaginatedResponse<AdminPharmacy>>>('/admin/pharmacies'),
        apiFetch<ApiResponse<PaginatedResponse<Medicine>>>('/admin/medicines?page=1')
    ]);

    const pharmacies = pharmaciesRes.data?.data || [];
    const pending = pharmacies.filter(p => p.verification_status === 'pending').length;
    const verified = pharmacies.filter(p => p.verification_status === 'verified').length;
    const rejected = pharmacies.filter(p => p.verification_status === 'rejected').length;
>>>>>>> main

    return {
        pendingVerifications: pending,
        verifiedPharmacies: verified,
        rejected: rejected,
        totalMedicines: medicinesRes.data?.meta?.total || 0
    };
}

/**
 * Get pending pharmacies for verification list
 */
export async function getPendingPharmacies(): Promise<AdminPharmacy[]> {
    const res = await apiFetch<ApiResponse<PaginatedResponse<AdminPharmacy>>>('/admin/pharmacies?status=pending');
    return res.data?.data || [];
}
