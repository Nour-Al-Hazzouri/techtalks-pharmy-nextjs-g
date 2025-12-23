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
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $inventory = $this->medicineService->getInventory($pharmacy);
            return $this->successResponse('Inventory', MedicineResource::collection($inventory)->response()->getData(true));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to load inventory: ' . $e->getMessage(), [], 500);
        }
    }

    public function store(InventoryRequest $request)
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $this->medicineService->addInventoryItem($pharmacy, $request->validated());
            return $this->successResponse('Item added to inventory');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to add item: ' . $e->getMessage(), [], 500);
        }
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
        try {
            $request->validate(['file' => 'required|file|mimes:csv,txt']);
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $path = $request->file('file')->getRealPath();
            $data = CsvParser::parse($path);

            // CSV now expects: medicine_name, quantity, price

            foreach ($data as $row) {
                 if (isset($row['medicine_name'])) {
                     $medicine = $this->medicineService->findOrCreateMedicineByName($row['medicine_name']);
                     
                     // Add ID to row data for the service call
                     $row['medicine_id'] = $medicine->id;
                     
                     $this->medicineService->addInventoryItem($pharmacy, $row);
                 }
            }

            return $this->successResponse('CSV Processed');
        } catch (\Exception $e) {
            return $this->errorResponse('CSV upload failed: ' . $e->getMessage(), [], 500);
        }
    }

    public function template()
    {
        // Return a simple CSV content or link
        return response("medicine_name,quantity,price\nPanadol,100,20.50", 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template.csv"',
        ]);
    }


   public function export()
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);

            if (!$pharmacy) {
                return $this->errorResponse('Pharmacy not found', [], 404);
            }

            // IMPORTANT: load inventory WITH medicine relation
            $inventory = $pharmacy->inventory()->with('medicine')->get();

            $fileName = 'inventory_' . now()->format('Y_m_d_His') . '.csv';

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"$fileName\"",
            ];

            $callback = function () use ($inventory) {
                $file = fopen('php://output', 'w');

                // CSV Header
                fputcsv($file, [
                    'medicine_name',
                    'quantity',
                    'price',
                    'available'
                ]);

                foreach ($inventory as $item) {
                    fputcsv($file, [
                        optional($item->medicine)->name, // SAFE ACCESS
                        $item->quantity,
                        $item->price,
                        $item->available ? 'yes' : 'no',
                    ]);
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);

        } catch (\Exception $e) {
            return $this->errorResponse(
                'Export failed: ' . $e->getMessage(),
                [],
                500
            );
        }
    }


}
