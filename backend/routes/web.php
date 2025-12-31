<?php

use Illuminate\Support\Facades\Route;

Route::get('/storage/{path}', function (string $path) {
    if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return \Illuminate\Support\Facades\Storage::disk('public')->response($path);
})->where('path', '.*');

Route::get('/', function () {
    return view('welcome');
});
