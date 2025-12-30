<?php

namespace App\Repositories;

use App\Models\Pharmacy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PharmacyRepository
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Pharmacy::query();

        if (isset($filters['verified'])) {
            $isVerified = filter_var($filters['verified'], FILTER_VALIDATE_BOOLEAN);
            if ($isVerified) {
                $query->where('verification_status', 'verified');
            } else {
                $query->where('verification_status', '!=', 'verified');
            }
        }

        if (isset($filters['status'])) {
            $query->where('verification_status', $filters['status'])
                  ->with('documents');
        }

        return $query->paginate(10);
    }

    public function getById($id): ?Pharmacy
    {
        return Pharmacy::with(['pharmacist', 'documents'])->find($id);
    }

    public function create(array $data): Pharmacy
    {
        return Pharmacy::create($data);
    }

    public function update($id, array $data): ?Pharmacy
    {
        $pharmacy = Pharmacy::find($id);
        if ($pharmacy) {
            $pharmacy->update($data);
        }
        return $pharmacy;
    }

    public function getByPharmacistId($userId): ?Pharmacy
    {
        return Pharmacy::where('pharmacist_id', $userId)->first();
    }

    public function getAdminList(array $filters = []): LengthAwarePaginator
    {
        $query = Pharmacy::with(['pharmacist', 'documents'])
            ->orderByDesc('updated_at');

        if (isset($filters['status'])) {
            $query->where('verification_status', $filters['status']);
        }

        return $query->paginate(10);
    }
    
    public function getTopRated(): Collection
    {
        return Pharmacy::where('verification_status', 'verified')
            ->orderByDesc('rating')
            ->limit(5)
            ->get();
    }
}
