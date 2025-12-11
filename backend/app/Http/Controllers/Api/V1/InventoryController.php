<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MedicineService;
use App\Services\PharmacyService;
use App\Http\Requests\InventoryRequest;
use App\Traits\ApiResponse;
use App\Http\Resources\MedicineResource;
use App\Utils\CsvParser;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    use ApiResponse;

    protected $medicineService;
    protected $pharmacyService;

    public function __construct(MedicineService $medicineService, PharmacyService $pharmacyService)
    {
        $this->medicineService = $medicineService;
        $this->pharmacyService = $pharmacyService;
    }

    public function index()
    {
        $user = auth()->user();
        $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
        if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

        $inventory = $this->medicineService->getInventory($pharmacy);
        return $this->successResponse('Inventory', MedicineResource::collection($inventory)->response()->getData(true));
    }

    public function store(InventoryRequest $request)
    {
        $user = auth()->user();
        $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
        if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

        $this->medicineService->addInventoryItem($pharmacy, $request->validated());
        return $this->successResponse('Item added to inventory');
    }

    public function update(InventoryRequest $request, $id)
    {
        $user = auth()->user();
        $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
        if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

        $this->medicineService->updateInventoryItem($pharmacy, $id, $request->validated());
        return $this->successResponse('Item updated');
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
        if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

        $this->medicineService->deleteInventoryItem($pharmacy, $id);
        return $this->successResponse('Item removed from inventory');
    }
    
    public function uploadCsv(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt']);
        $user = auth()->user();
        $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
        if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);
        
        $path = $request->file('file')->getRealPath();
        $data = CsvParser::parse($path);
        
        // Assuming CSV has medicine_id, quantity, price
        // OR name, quantity, price -> find medicine by name
        
        foreach ($data as $row) {
             // Basic logic assuming medicine_id is present
             if (isset($row['medicine_id'])) {
                 $this->medicineService->addInventoryItem($pharmacy, $row);
             }
        }
        
        return $this->successResponse('CSV Processed');
    }
    
    public function template()
    {
        // Return a simple CSV content or link
        return response("medicine_id,quantity,price\n1,100,20.50", 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template.csv"',
        ]);
    }
    
    public function export()
    {
        // Export logic... simplified
        return $this->successResponse('Export not fully implemented in this demo', []);
    }
}
