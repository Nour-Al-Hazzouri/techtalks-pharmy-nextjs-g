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

    public function getAllPharmacies()
    {
        return $this->repo->getAll();
    }

    public function getPharmacy($id)
    {
        return $this->repo->getById($id);
    }

    public function registerPharmacy(User $user, array $data)
    {
        $data['pharmacist_id'] = $user->id;
        $data['verification_status'] = 'pending';
        return $this->repo->create($data);
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
    public function getAllPharmaciesAdmin()
    {
        return $this->repo->getAdminList();
    }
    
    public function approvePharmacy($id)
    {
        return $this->repo->update($id, ['verification_status' => 'verified', 'verified' => true]);
    }
    
    public function rejectPharmacy($id, $reason)
    {
        return $this->repo->update($id, ['verification_status' => 'rejected', 'rejection_reason' => $reason]);
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
}
