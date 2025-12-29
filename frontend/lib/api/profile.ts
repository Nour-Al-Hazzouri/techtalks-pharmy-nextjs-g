import { apiFetch } from "./config"
import type { ApiResponse, User } from "./types"

export type UpdateProfileRequest = {
    email?: string
    name?: string
    phone?: string | null
}

export type ChangePasswordRequest = {
    old_password: string
    new_password: string
    new_password_confirmation: string
}

export type ChangePasswordResponse = {
    success: boolean
    message: string
}

export async function getMyProfile(): Promise<ApiResponse<User>> {
    return apiFetch<ApiResponse<User>>("/profile")
}

export async function updateMyProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return apiFetch<ApiResponse<User>>("/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}

export async function changeMyPassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return apiFetch<ChangePasswordResponse>("/profile/password", {
        method: "PUT",
        body: JSON.stringify(data),
    })
}
