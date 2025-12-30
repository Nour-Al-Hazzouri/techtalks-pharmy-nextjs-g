<?php

namespace App\Services;

use App\Repositories\MedicineRepository;
use App\Models\Medicine;
use App\Models\Pharmacy;
use App\Utils\GeoLocationService;
use App\Repositories\InventoryRepository;

class MedicineService
{
    protected $medicineRepo;
    protected $inventoryRepo;

    public function __construct(MedicineRepository $medicineRepo, InventoryRepository $inventoryRepo)
    {
        $this->medicineRepo = $medicineRepo;
        $this->inventoryRepo = $inventoryRepo;
    }

    public function searchMedicines($name)
    {
        // This search needs to show matching pharmacies + availability
        // So we shouldn't just return medicines.
        // We find the medicine, then load its pharmacies.

        $medicines = $this->medicineRepo->search($name);
        // Eager load pharmacies
        // Removed verification check for testing purposes
        $medicines->load(['pharmacies']);

        return $medicines;
    }

    public function autocomplete($query)
    {
        return $this->medicineRepo->autocomplete($query);
    }

    public function suggestions(int $limit = 5)
    {
        return $this->medicineRepo->suggestions($limit);
    }

    public function findNearest($medicineName, $lat, $lng)
    {
        // 1. Find the medicine
        // 2. Find pharmacies having it available
        // 3. Calc distance using Haversine
        // 4. Sort

        $medicine = $this->medicineRepo->findByName($medicineName);
        if (!$medicine) return [];

        $pharmacies = $medicine->pharmacies()
                        ->wherePivot('available', true)
                        // ->where('verification_status', 'verified') // Removed for testing
                        ->get();

        $results = $pharmacies->map(function($p) use ($lat, $lng) {
            $dist = GeoLocationService::getDistance($lat, $lng, $p->latitude, $p->longitude);
            $p->distance = $dist;
            return $p;
        })->sortBy('distance')->values();

        return $results;
    }

    public function findOrCreateMedicineByName($name)
    {
        $medicine = $this->medicineRepo->findByName($name);
        
        if (!$medicine) {
            $medicine = Medicine::create([
                'name' => $name
            ]);
        }
        
        return $medicine;
    }

    // Inventory
    public function getInventory(Pharmacy $pharmacy)
    {
        // Use medicines() to get Medicine models with pivot data
        return $pharmacy->medicines()->get();
    }

    public function addInventoryItem(Pharmacy $pharmacy, array $data)
    {
        $attributes = [
            'quantity' => $data['quantity'],
            'price' => $data['price'],
        ];

        // Respect explicitly passed 'available', otherwise default based on quantity
        if (isset($data['available'])) {
            $attributes['available'] = $data['available'];
        } else {
            $attributes['available'] = $data['quantity'] > 0;
        }

        return $this->inventoryRepo->updateStock($pharmacy, $data['medicine_id'], $attributes);
    }

    public function updateInventoryItem(Pharmacy $pharmacy, $id, array $data)
    {
        $attributes = $data;
        
        // Only override 'available' if it is NOT provided in the request
        if (isset($data['quantity']) && !isset($data['available'])) {
            $attributes['available'] = $data['quantity'] > 0;
        }
        
        return $this->inventoryRepo->updatePivot($pharmacy, $id, $attributes);
    }

    public function deleteInventoryItem(Pharmacy $pharmacy, $id)
    {
        return $this->inventoryRepo->removeStock($pharmacy, $id);
    }
}
