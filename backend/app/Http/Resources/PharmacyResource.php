<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'verified' => $this->verified,
            'license_number' => $this->license_number,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'verification_status' => $this->verification_status,
            'rejection_reason' => $this->when($this->verification_status === 'rejected', $this->rejection_reason),
            'rating' => $this->rating,
            'total_reports' => $this->reports()->count(),
            'distance' => $this->when(isset($this->distance), $this->distance),
            'medicines' => MedicineResource::collection($this->whenLoaded('medicines')),
            'documents' => $this->whenLoaded('documents'),
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
