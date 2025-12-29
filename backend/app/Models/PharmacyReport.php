<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'user_id',
        'reason',
        'report_type',
        'report_status',
        'resolution_notes'
    ];

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
