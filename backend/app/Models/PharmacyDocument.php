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

    protected $appends = ['file_url'];

    public function getFileUrlAttribute()
    {
        if (!$this->file_path) {
            return null;
        }

        $baseUrl = rtrim(config('app.url') ?: request()->getSchemeAndHttpHost(), '/');
        if (str_starts_with($baseUrl, 'http://')) {
            $baseUrl = 'https://' . substr($baseUrl, 7);
        }

        return $baseUrl . '/storage/' . ltrim($this->file_path, '/');
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
