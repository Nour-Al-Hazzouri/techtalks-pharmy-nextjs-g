<?php

namespace App\Repositories;

use App\Models\PharmacyReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReportRepository
{
    public function create(array $data): PharmacyReport
    {
        return PharmacyReport::create($data);
    }

    public function getByUser($userId): LengthAwarePaginator
    {
        return PharmacyReport::where('user_id', $userId)->paginate(10);
    }

    public function getAll(): LengthAwarePaginator
    {
        return PharmacyReport::with(['pharmacy', 'reporter'])->paginate(10);
    }

    public function getById($id): ?PharmacyReport
    {
        return PharmacyReport::find($id);
    }

    public function updateStatus($id, string $status, ?string $notes = null)
    {
        $report = PharmacyReport::find($id);
        if ($report) {
            $report->report_status = $status;
            if ($notes) {
                $report->resolution_notes = $notes;
            }
            $report->save();
        }
        return $report;
    }
    
    public function getStatistics()
    {
        return [
            'total' => PharmacyReport::count(),
            'pending' => PharmacyReport::where('report_status', 'pending')->count(),
            'resolved' => PharmacyReport::where('report_status', 'resolved')->count(),
        ];
    }
}
