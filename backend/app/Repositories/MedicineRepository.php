<?php

namespace App\Repositories;

use App\Models\Medicine;
use Illuminate\Database\Eloquent\Collection;

class MedicineRepository
{
    public function search(string $name): Collection
    {
        $operator = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ILIKE' : 'LIKE';
        return Medicine::where('name', $operator, "%{$name}%")->get();
    }

    public function suggestions(int $limit = 5): Collection
    {
        return Medicine::query()
            ->select('name', 'category')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    public function autocomplete(string $query): Collection
    {
        $operator = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ILIKE' : 'LIKE';
        return Medicine::where('name', $operator, "%{$query}%")
            ->select('name', 'category')
            ->limit(10)
            ->get()
            ->groupBy('category');
    }

    public function findByName(string $name): ?Medicine
    {
        return Medicine::where('name', $name)->first(); // Exact match
    }

    public function getAll()
    {
        return Medicine::paginate(20);
    }
}
