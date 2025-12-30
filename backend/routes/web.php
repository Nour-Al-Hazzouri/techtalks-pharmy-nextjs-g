<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/storage/documents/{path}', function (string $path) {
    if (str_contains($path, '..')) {
        abort(404);
    }

    $relativePath = 'documents/' . ltrim($path, '/');
    if (!Storage::disk('public')->exists($relativePath)) {
        abort(404);
    }

    $absolutePath = Storage::disk('public')->path($relativePath);
    return response()->file($absolutePath);
})->where('path', '.*');
