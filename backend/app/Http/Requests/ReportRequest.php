<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'reason' => ['required', 'string', 'min:10', 'regex:/\\S/'],
            'report_type' => 'required|in:wrong_availability,wrong_location,wrong_contact,other',
        ];
    }
}
