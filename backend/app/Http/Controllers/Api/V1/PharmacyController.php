<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PharmacyService;
use App\Http\Requests\PharmacyRequest;
use App\Traits\ApiResponse;
use App\Http\Resources\PharmacyResource;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    use ApiResponse;

    protected $pharmacyService;

    public function __construct(PharmacyService $pharmacyService)
    {
        $this->pharmacyService = $pharmacyService;
    }

    // Public
    public function index(Request $request)
    {
        try {
            $filters = [];
            if ($request->has('verified')) {
                $filters['verified'] = $request->input('verified');
            }
            if ($request->has('status')) {
                $filters['status'] = $request->input('status');
            }

            $pharmacies = $this->pharmacyService->getAllPharmacies($filters);
            return $this->successResponse('Pharmacies list', PharmacyResource::collection($pharmacies)->response()->getData(true));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve pharmacies: ' . $e->getMessage(), [], 500);
        }
    }

    public function show($id)
    {
        try {
            $pharmacy = $this->pharmacyService->getPharmacy($id);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);
            return $this->successResponse('Pharmacy details', new PharmacyResource($pharmacy));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve pharmacy: ' . $e->getMessage(), [], 500);
        }
    }

    public function topRated()
    {
        $pharmacies = $this->pharmacyService->getTopRated();
        return $this->successResponse('Top rated pharmacies', PharmacyResource::collection($pharmacies));
    }

    // Pharmacist
    public function register(PharmacyRequest $request)
    {
        try {
            $user = auth()->user();
            if ($user->role !== 'pharmacist') return $this->errorResponse('Unauthorized', [], 403);

            // Ensure user doesn't already have one?
            if ($user->pharmacy) return $this->errorResponse('You already have a pharmacy registered', [], 400);

            $pharmacy = $this->pharmacyService->registerPharmacy($user, $request->validated());
            return $this->successResponse('Pharmacy registered successfully', new PharmacyResource($pharmacy), 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to register pharmacy: ' . $e->getMessage(), [], 500);
        }
    }

    public function myProfile()
    {
         $user = auth()->user();
         $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
          if (!$pharmacy) return $this->errorResponse('No pharmacy found', [], 404);
          return $this->successResponse('Pharmacy Profile', new PharmacyResource($pharmacy));
    }

    public function updateProfile(PharmacyRequest $request)
    {
         $user = auth()->user();
         $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
         if (!$pharmacy) return $this->errorResponse('No pharmacy found', [], 404);

         $pharmacy = $this->pharmacyService->updateProfile($pharmacy->id, $request->validated());
         return $this->successResponse('Pharmacy Updated', new PharmacyResource($pharmacy));
    }

    public function dashboardStats()
    {
        $user = auth()->user();
         $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
         if (!$pharmacy) return $this->errorResponse('No pharmacy found', [], 404);

         $stats = $this->pharmacyService->getDashboardStats($pharmacy);
         return $this->successResponse('Dashboard Stats', $stats);
    }

    // Admin
    public function adminIndex()
    {
        $pharmacies = $this->pharmacyService->getAllPharmaciesAdmin();
        return $this->successResponse('Admin Pharmacies list', PharmacyResource::collection($pharmacies)->response()->getData(true));
    }

    public function approve($id)
    {
        $pharmacy = $this->pharmacyService->approvePharmacy($id);
        if(!$pharmacy) return $this->errorResponse('Not found', [], 404);
         return $this->successResponse('Pharmacy Approved', new PharmacyResource($pharmacy));
    }

    public function reject(Request $request, $id)
    {
        $request->validate(['reason' => 'required']);
        $pharmacy = $this->pharmacyService->rejectPharmacy($id, $request->reason);
         if(!$pharmacy) return $this->errorResponse('Not found', [], 404);
         return $this->successResponse('Pharmacy Rejected', new PharmacyResource($pharmacy));
    }

    // Documents
    public function uploadDocument(\App\Http\Requests\PharmacyDocumentRequest $request)
    {
        try {
            $user = auth()->user();
             // Assuming user has 'pharmacy' relation or via service
             // The service method getPharmacyProfile uses user->id
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $document = $this->pharmacyService->uploadDocument($pharmacy, $request->validated(), $request->file('file'));
            return $this->successResponse('Document uploaded', $document, 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Upload failed: ' . $e->getMessage(), [], 500);
        }
    }

    public function submitForVerification()
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $this->pharmacyService->submitForVerification($pharmacy->id);
            return $this->successResponse('Verification request submitted');
        } catch (\Exception $e) {
            return $this->errorResponse('Submission failed: ' . $e->getMessage(), [], 500);
        }
    }
    public function cancelVerification()
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $this->pharmacyService->cancelVerificationSubmission($pharmacy->id);
            return $this->successResponse('Verification request cancelled');
        } catch (\Exception $e) {
            return $this->errorResponse('Cancellation failed: ' . $e->getMessage(), [], 500);
        }
    }

    public function adminGetDocuments($id)
    {
        $documents = $this->pharmacyService->getDocuments($id);
        return $this->successResponse('Pharmacy Documents', $documents);
    }

    public function myDocuments()
    {
        $user = auth()->user();
        $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
        if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

        $documents = $this->pharmacyService->getDocuments($pharmacy->id);
        return $this->successResponse('My Documents', $documents);
    }

    public function updateDocument(\App\Http\Requests\PharmacyDocumentRequest $request, $id)
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $document = $this->pharmacyService->updateDocument($pharmacy, $id, $request->validated(), $request->file('file'));
            return $this->successResponse('Document updated', $document);
        } catch (\Exception $e) {
            return $this->errorResponse('Update failed: ' . $e->getMessage(), [], 500);
        }
    }

    public function deleteDocument($id)
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $this->pharmacyService->deleteDocument($pharmacy, $id);
            return $this->successResponse('Document deleted');
        } catch (\Exception $e) {
            return $this->errorResponse('Delete failed: ' . $e->getMessage(), [], 500);
        }
    }

    public function adminGetAllDocuments()
    {
        $documents = $this->pharmacyService->getAllDocuments();
        return $this->successResponse('All Pharmacy Documents', $documents);
    }

    public function showDocument($id)
    {
        try {
            $user = auth()->user();
            $pharmacy = $this->pharmacyService->getPharmacyProfile($user);
            if (!$pharmacy) return $this->errorResponse('Pharmacy not found', [], 404);

            $document = $this->pharmacyService->getDocument($pharmacy, $id);
            return $this->successResponse('Document details', $document);
        } catch (\Exception $e) {
            return $this->errorResponse('Document not found or access denied', [], 404);
        }
    }
}
