<?php

namespace App\Services;

use App\Repositories\PharmacyRepository;
use App\Models\Pharmacy;
use App\Utils\GeoLocationService;
use App\Models\User;

class PharmacyService
{
    protected $repo;

    public function __construct(PharmacyRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getAllPharmacies(array $filters = [])
    {
        return $this->repo->getAll($filters);
    }

    public function getPharmacy($id)
    {
        return $this->repo->getById($id);
    }

    public function registerPharmacy(User $user, array $data)
    {
        $data['pharmacist_id'] = $user->id;
        $data['verification_status'] = 'incomplete';
        return $this->repo->create($data);
    }

    public function submitForVerification($pharmacyId)
    {
        return $this->repo->update($pharmacyId, ['verification_status' => 'pending']);
    }

    public function cancelVerificationSubmission($pharmacyId)
    {
        return $this->repo->update($pharmacyId, ['verification_status' => 'incomplete']);
    }

    public function getPharmacyProfile(User $user)
    {
        return $this->repo->getByPharmacistId($user->id);
    }
    
    public function updateProfile($id, array $data)
    {
        // Add logic to check if user owns pharmacy if needed, but controller handles auth
        return $this->repo->update($id, $data);
    }
    
    // Admin methods
    public function getAllPharmaciesAdmin(array $filters = [])
    {
        return $this->repo->getAdminList($filters);
    }
    
    public function approvePharmacy($id)
    {
        return $this->repo->update($id, ['verification_status' => 'verified', 'verified' => true]);
    }
    
    public function rejectPharmacy($id, $reason)
    {
        return $this->repo->update($id, ['verification_status' => 'rejected', 'verified' => false, 'rejection_reason' => $reason]);
    }

    public function getTopRated()
    {
        return $this->repo->getTopRated();
    }
    
     public function getDashboardStats(Pharmacy $pharmacy)
    {
        // - total medicines
        // - total available items
        // - low stock count
        // - out-of-stock items
        // - total reports received
        // - average rating
        
        $medicines = $pharmacy->medicines();
        
        return [
            'total_medicines' => $medicines->count(),
            'total_available' => $medicines->wherePivot('available', true)->count(),
            'low_stock_count' => $medicines->wherePivot('quantity', '<', 10)->count(), // Assuming 10 is low
            'out_of_stock' => $medicines->wherePivot('quantity', 0)->count(),
            'total_reports' => $pharmacy->reports()->count(),
            'average_rating' => $pharmacy->rating
        ];
    }

    // Documents
    public function uploadDocument(Pharmacy $pharmacy, array $data, $file)
    {
        $path = $file->store('documents/' . $pharmacy->id, 'public');
        
        return $pharmacy->documents()->create([
            'file_path' => $path,
            'doc_type' => $data['doc_type']
        ]);
    }

    public function getDocuments($pharmacyId)
    {
        return \App\Models\PharmacyDocument::where('pharmacy_id', $pharmacyId)->get();
    }

    public function updateDocument(Pharmacy $pharmacy, $documentId, array $data, $file)
    {
        $document = $pharmacy->documents()->findOrFail($documentId);
        
        // Delete old file
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($document->file_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);
        }

        // Upload new file
        $path = $file->store('documents/' . $pharmacy->id, 'public');

        $document->update([
            'file_path' => $path,
            'doc_type' => $data['doc_type'] ?? $document->doc_type
        ]);

        return $document;
    }

    public function deleteDocument(Pharmacy $pharmacy, $documentId)
    {
        if ($pharmacy->verification_status === 'pending') {
            throw new \Exception('Cannot delete documents while verification is pending.');
        }

        $document = $pharmacy->documents()->findOrFail($documentId);

        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($document->file_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);
        }

        return $document->delete();
    }

    public function getAllDocuments()
    {
        return \App\Models\PharmacyDocument::with('pharmacy:id,name,license_number')->latest()->get();
    }

    public function getDocument(Pharmacy $pharmacy, $documentId)
    {
        return $pharmacy->documents()->findOrFail($documentId);
    }
}
