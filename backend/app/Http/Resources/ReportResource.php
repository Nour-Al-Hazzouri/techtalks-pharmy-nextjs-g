<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pharmacy_id' => $this->pharmacy_id,
            'user_id' => $this->user_id,
            'pharmacy' => new PharmacyResource($this->whenLoaded('pharmacy')),
            'user' => new UserResource($this->whenLoaded('reporter')),
            'reason' => $this->reason,
            'report_type' => $this->report_type,
            'status' => $this->report_status,
            'resolution_notes' => $this->resolution_notes,
            'created_at' => $this->created_at,
        ];
    }
}
