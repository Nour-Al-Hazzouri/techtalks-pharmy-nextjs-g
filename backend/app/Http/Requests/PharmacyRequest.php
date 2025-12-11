<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PharmacyRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Add more logic if necessary
        return true; 
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string',
            'license_number' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ];
    }
}
