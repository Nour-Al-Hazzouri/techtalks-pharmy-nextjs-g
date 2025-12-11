<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ReportingService;
use App\Http\Requests\ReportRequest;
use App\Traits\ApiResponse;
use App\Http\Resources\ReportResource;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(ReportingService $service)
    {
        $this->service = $service;
    }

    public function store(ReportRequest $request)
    {
        $report = $this->service->createReport(auth()->id(), $request->validated());
        return $this->successResponse('Report submitted', new ReportResource($report), 201);
    }

    public function myReports()
    {
        $reports = $this->service->getUserReports(auth()->id());
        return $this->successResponse('My Reports', ReportResource::collection($reports)->response()->getData(true));
    }

    // Admin
    public function index()
    {
        $reports = $this->service->getAllReports();
        return $this->successResponse('All Reports', ReportResource::collection($reports)->response()->getData(true));
    }
    
    public function show($id)
    {
        $report = $this->service->getReport($id);
        if (!$report) return $this->errorResponse('Not found', [], 404);
        return $this->successResponse('Report details', new ReportResource($report));
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,resolved,dismissed', 'notes' => 'nullable|string']);
        $report = $this->service->updateStatus($id, $request->status, $request->notes);
        if (!$report) return $this->errorResponse('Not found', [], 404);
        return $this->successResponse('Report status updated', new ReportResource($report));
    }
    
    public function statistics()
    {
        $stats = $this->service->getStats();
        return $this->successResponse('Report Statistics', $stats);
    }
}
