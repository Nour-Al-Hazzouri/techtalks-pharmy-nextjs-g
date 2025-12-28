<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Traits\ApiResponse;
use App\Http\Resources\MedicineResource;
use Illuminate\Http\Request;

class AdminMedicineController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $query = Medicine::query();

            if ($request->has('search')) {
                $search = $request->search;
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('generic_name', 'like', "%{$search}%");
            }

            $perPage = $request->get('per_page', 15);
            $medicines = $query->latest()->paginate($perPage);

            return $this->successResponse('Medicines list', MedicineResource::collection($medicines)->response()->getData(true));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch medicines: ' . $e->getMessage(), [], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:medicines,name',
                'generic_name' => 'nullable|string',
                'category' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $medicine = Medicine::create($validated);

            return $this->successResponse('Medicine created successfully', new MedicineResource($medicine), 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create medicine: ' . $e->getMessage(), [], 500);
        }
    }

    public function show($id)
    {
        try {
            $medicine = Medicine::findOrFail($id);
            return $this->successResponse('Medicine details', new MedicineResource($medicine));
        } catch (\Exception $e) {
            return $this->errorResponse('Medicine not found', [], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $medicine = Medicine::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|unique:medicines,name,' . $id,
                'generic_name' => 'nullable|string',
                'category' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $medicine->update($validated);

            return $this->successResponse('Medicine updated successfully', new MedicineResource($medicine));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update medicine: ' . $e->getMessage(), [], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $medicine = Medicine::findOrFail($id);
            
            // Optional: Check if used in pharmacy inventory before delete?
            // For now, allow delete (cascading deletes usually handled in DB foreign keys if set)
            // But Migration didn't show foreign key constraints heavily enforced on delete.
            // Let's assume soft deletes aren't enabled based on model.

            $medicine->delete();

            return $this->successResponse('Medicine deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete medicine: ' . $e->getMessage(), [], 500);
        }
    }
}
