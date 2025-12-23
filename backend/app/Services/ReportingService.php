<?php

namespace App\Services;

use App\Repositories\ReportRepository;

class ReportingService
{
    protected $repo;

    public function __construct(ReportRepository $repo)
    {
        $this->repo = $repo;
    }

    public function createReport($userId, array $data)
    {
        $data['user_id'] = $userId;
        return $this->repo->create($data);
    }

    public function getUserReports($userId)
    {
        return $this->repo->getByUser($userId);
    }

    public function getAllReports()
    {
        return $this->repo->getAll();
    }
    
    public function getReport($id)
    {
        return $this->repo->getById($id);
    }
    
    public function updateStatus($id, $status, $notes)
    {
        return $this->repo->updateStatus($id, $status, $notes);
    }
    
    public function getStats()
    {
        return $this->repo->getStatistics();
    }
}
