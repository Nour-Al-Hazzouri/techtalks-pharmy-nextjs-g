<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'generic_name' => $this->generic_name,
            'category' => $this->category,
            'description' => $this->description,
            'pharmacies' => PharmacyResource::collection($this->whenLoaded('pharmacies')),
             'pivot' => $this->whenPivotLoaded('pharmacy_medicines', function () {
                return [
                   'quantity' => $this->pivot->quantity,
                   'price' => $this->pivot->price,
                   'available' => $this->pivot->available,
                ];
            }),
        ];
    }
}
