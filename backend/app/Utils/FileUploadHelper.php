<?php

namespace App\Utils;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class FileUploadHelper
{
    /**
     * Upload a file and return the path.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @return string
     */
    public static function upload(UploadedFile $file, string $folder = 'uploads'): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        return $file->storeAs($folder, $filename, 'public');
    }
}
