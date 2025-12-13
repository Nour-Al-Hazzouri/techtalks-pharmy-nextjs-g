<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PharmacyMedicine extends Pivot
{
    protected $table = 'pharmacy_medicines';

    public $incrementing = false; // Because we removed id and use composite key

    protected $fillable = [
        'pharmacy_id',
        'medicine_id',
        'quantity',
        'price',
        'available'
    ];

    protected $casts = [
        'available' => 'boolean',
        'price' => 'decimal:2',
    ];
    public function medicine()
{
    return $this->belongsTo(Medicine::class, 'medicine_id');
}
}
