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
        $medicines->load(['pharmacies' => function($q) {
            $q->where('verification_status', 'verified');
        }]);
        
        return $medicines;
    }

    public function autocomplete($query)
    {
        return $this->medicineRepo->autocomplete($query);
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
                        ->where('verification_status', 'verified')
                        ->get();
                        
        $results = $pharmacies->map(function($p) use ($lat, $lng) {
            $dist = GeoLocationService::getDistance($lat, $lng, $p->latitude, $p->longitude);
            $p->distance = $dist;
            return $p;
        })->sortBy('distance')->values();
        
        return $results;
    }
    
    // Inventory
    public function getInventory(Pharmacy $pharmacy)
    {
        return $this->inventoryRepo->getInventory($pharmacy);
    }
    
    public function addInventoryItem(Pharmacy $pharmacy, array $data)
    {
        // Check if medicine exists, if not create? Prompt implies medicine list is seeded.
        // Assuming medicine_id is passed.
        
        return $this->inventoryRepo->updateStock($pharmacy, $data['medicine_id'], [
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'available' => $data['quantity'] > 0
        ]);
    }
    
    public function updateInventoryItem(Pharmacy $pharmacy, $id, array $data)
    {
        // $id here is probably medicine_id from the route /inventory/{id}
         return $this->inventoryRepo->updateStock($pharmacy, $id, [
            'quantity' => $data['quantity'],
            'price' => $data['price'],
             'available' => $data['quantity'] > 0
        ]);
    }
    
    public function deleteInventoryItem(Pharmacy $pharmacy, $id)
    {
        return $this->inventoryRepo->removeStock($pharmacy, $id);
    }
}
