<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'regex:/^\p{L}[\p{L}\p{M}]*(?:[ \-\'\x{2019}]\p{L}[\p{L}\p{M}]*)*$/u'],
            'email' => ['required', 'string', 'email', 'regex:/^[^\s@]+@[^\s@]+\.[^\s@]{1,}$/', 'max:255', 'unique:users'],
            'password' => 'required|string|min:6',
            'role' => 'sometimes|in:user,pharmacist', // Admin not allowed via public register typically, but strict to prompt
            'phone' => ['nullable', 'string', 'max:50', 'regex:/^(?:\+961 ?\d{2} ?\d{3} ?\d{3}|\+961\d{8}|00961 ?\d{2} ?\d{3} ?\d{3}|00961\d{8}|\d{2} ?\d{3} ?\d{3}|\d{8})$/'],
        ];
    }
}
