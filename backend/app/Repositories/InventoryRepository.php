<?php

namespace App\Repositories;

use App\Models\Pharmacy;
use App\Models\PharmacyMedicine;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InventoryRepository
{
    public function getInventory(Pharmacy $pharmacy): LengthAwarePaginator
    {
        return $pharmacy->medicines()->paginate(10);
    }

    public function updateStock(Pharmacy $pharmacy, $medicineId, array $data)
    {
        return $pharmacy->medicines()->syncWithoutDetaching([
            $medicineId => $data
        ]);
    }

    public function removeStock(Pharmacy $pharmacy, $medicineId)
    {
        return $pharmacy->medicines()->detach($medicineId);
    }
    
    public function findPivot($pharmacyId, $medicineId)
    {
         return PharmacyMedicine::where('pharmacy_id', $pharmacyId)
            ->where('medicine_id', $medicineId)
            ->first();
    }
}
