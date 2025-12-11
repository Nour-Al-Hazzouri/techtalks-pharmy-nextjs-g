<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'medicine_id' => 'required_without:name|exists:medicines,id',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ];
    }
}
