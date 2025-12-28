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
        $rules = [
            'medicine_id' => 'required_without:name|exists:medicines,id',
            'name' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            foreach ($rules as $key => $rule) {
                $rules[$key] = 'sometimes|' . $rule;
            }
        }

        return $rules;
    }
}
