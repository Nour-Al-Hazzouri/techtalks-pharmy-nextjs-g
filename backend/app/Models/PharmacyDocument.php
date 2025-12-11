<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'file_path',
        'doc_type'
    ];

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
