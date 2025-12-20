<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PharmacyController;
use App\Http\Controllers\Api\V1\MedicineController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\ReportController;

Route::prefix('v1')->group(function () {

    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    // Public Pharmacy Routes
    Route::get('pharmacies', [PharmacyController::class, 'index']);
    Route::get('pharmacies/top-rated', [PharmacyController::class, 'topRated']);
    Route::get('pharmacies/{id}', [PharmacyController::class, 'show']);

    // Medicine Routes (Public)
    Route::get('medicines/search', [MedicineController::class, 'search']);
    Route::get('medicines/autocomplete', [MedicineController::class, 'autocomplete']);
    Route::get('medicines/nearest', [MedicineController::class, 'nearest']);

    // Authenticated Routes
    Route::middleware('auth.jwt')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('profile/password', [AuthController::class, 'updatePassword']);
        
        // Reports (User)
        Route::post('reports', [ReportController::class, 'store']);
        Route::get('reports/my-reports', [ReportController::class, 'myReports']);

        // Pharmacist Routes
        Route::middleware('role:pharmacist')->group(function () {
            Route::post('pharmacy/register', [PharmacyController::class, 'register']);
            Route::get('pharmacy/profile', [PharmacyController::class, 'myProfile']);
            Route::put('pharmacy/profile', [PharmacyController::class, 'updateProfile']);
            
            Route::get('pharmacy/inventory', [InventoryController::class, 'index']);
            Route::post('pharmacy/inventory', [InventoryController::class, 'store']);
            Route::put('pharmacy/inventory/{id}', [InventoryController::class, 'update']);
            Route::delete('pharmacy/inventory/{id}', [InventoryController::class, 'destroy']);
            
            Route::post('pharmacy/inventory/upload', [InventoryController::class, 'uploadCsv']);
            Route::get('pharmacy/inventory/template', [InventoryController::class, 'template']);
            Route::get('pharmacy/inventory/export', [InventoryController::class, 'export']);
            
            Route::get('pharmacy/dashboard/stats', [PharmacyController::class, 'dashboardStats']);
        });

        // Admin Routes
        Route::middleware('role:admin')->group(function () {
             Route::get('admin/pharmacies', [PharmacyController::class, 'adminIndex']);
             Route::get('admin/pharmacies/{id}', [PharmacyController::class, 'show']); // Reuse public show or specialized admin show
             Route::put('admin/pharmacies/{id}/approve', [PharmacyController::class, 'approve']);
             Route::put('admin/pharmacies/{id}/reject', [PharmacyController::class, 'reject']);
             
             Route::get('admin/reports/statistics', [ReportController::class, 'statistics']);
             Route::get('admin/reports', [ReportController::class, 'index']);
             Route::get('admin/reports/{id}', [ReportController::class, 'show']);
             Route::put('admin/reports/{id}/status', [ReportController::class, 'updateStatus']);
             
        });
    });
});
