<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacist_id',
        'name',
        'address',
        'phone',
        'verified',
        'license_number',
        'latitude',
        'longitude',
        'verification_status',
        'rejection_reason',
        'rating',
        'account_status'
    ];

    protected $casts = [
        'verified' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'rating' => 'decimal:2',
    ];

    public function pharmacist()
    {
        return $this->belongsTo(User::class, 'pharmacist_id');
    }

    public function documents()
    {
        return $this->hasMany(PharmacyDocument::class);
    }

    public function medicines()
    {
        return $this->belongsToMany(Medicine::class, 'pharmacy_medicines')
                    ->using(PharmacyMedicine::class)
                    ->withPivot(['quantity', 'price', 'available', 'created_at', 'updated_at']);
    }

    public function reports()
    {
        return $this->hasMany(PharmacyReport::class);
    }
}
