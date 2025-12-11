<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MedicineService;
use App\Traits\ApiResponse;
use App\Http\Resources\MedicineResource;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    use ApiResponse;

    protected $medicineService;

    public function __construct(MedicineService $medicineService)
    {
        $this->medicineService = $medicineService;
    }

    public function search(Request $request)
    {
        try {
            $request->validate(['name' => 'required|string']);
            $medicines = $this->medicineService->searchMedicines($request->name);
            return $this->successResponse('Search results', MedicineResource::collection($medicines));
        } catch (\Exception $e) {
            return $this->errorResponse('Search failed: ' . $e->getMessage(), [], 500);
        }
    }

    public function autocomplete(Request $request)
    {
        try {
            $request->validate(['query' => 'required|string']);
            $results = $this->medicineService->autocomplete($request->query('query'));
            return $this->successResponse('Autocomplete results', $results);
        } catch (\Exception $e) {
            return $this->errorResponse('Autocomplete failed: ' . $e->getMessage(), [], 500);
        }
    }
    
    public function nearest(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'lat' => 'required|numeric',
                'lng' => 'required|numeric'
            ]);
            
            $results = $this->medicineService->findNearest($request->name, $request->lat, $request->lng);
            
            // Helper to format as simple array or resource
            // Since results are Pharmacy models with pivot
            return $this->successResponse('Nearest pharmacies having medicine', $results);
        } catch (\Exception $e) {
            return $this->errorResponse('Nearest search failed: ' . $e->getMessage(), [], 500);
        }
    }
}
