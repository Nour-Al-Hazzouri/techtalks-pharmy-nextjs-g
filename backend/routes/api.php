<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\GeocodeController;
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
    Route::get('medicines/suggestions', [MedicineController::class, 'suggestions']);
    Route::get('medicines/nearest', [MedicineController::class, 'nearest']);

    // Geocoding Routes (Public)
    Route::get('geocode/search', [GeocodeController::class, 'search']);

    // Authenticated Routes
    Route::middleware('auth.jwt')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::match(['put', 'patch'], 'profile', [AuthController::class, 'updateProfile']);
        Route::put('profile/password', [AuthController::class, 'updatePassword']);
        
        // Reports (User)
        Route::post('reports', [ReportController::class, 'store']);
        Route::get('reports/my-reports', [ReportController::class, 'myReports']);

        // Pharmacist Routes
        Route::middleware('role:pharmacist')->group(function () {
            Route::post('pharmacy/register', [PharmacyController::class, 'register']);
            Route::get('pharmacy/profile', [PharmacyController::class, 'myProfile']);
            Route::match(['put', 'patch'], 'pharmacy/profile', [PharmacyController::class, 'updateProfile']);
            Route::post('pharmacy/submit-verification', [PharmacyController::class, 'submitForVerification']);
            Route::post('pharmacy/cancel-verification', [PharmacyController::class, 'cancelVerification']);
            
            Route::get('pharmacy/inventory', [InventoryController::class, 'index']);
            Route::post('pharmacy/inventory', [InventoryController::class, 'store']);
            Route::put('pharmacy/inventory/{id}', [InventoryController::class, 'update']);
            Route::patch('pharmacy/inventory/{id}', [InventoryController::class, 'update']);
            Route::patch('debug-inventory/{id}', [InventoryController::class, 'update']);
            Route::delete('pharmacy/inventory/{id}', [InventoryController::class, 'destroy']);
            
            Route::post('pharmacy/inventory/upload', [InventoryController::class, 'uploadCsv']);
            Route::get('pharmacy/inventory/template', [InventoryController::class, 'template']);
            Route::get('pharmacy/inventory/export', [InventoryController::class, 'export']);
            
            Route::post('pharmacy/documents', [PharmacyController::class, 'uploadDocument']);
            Route::get('pharmacy/documents', [PharmacyController::class, 'myDocuments']);
            Route::get('pharmacy/documents/{id}', [PharmacyController::class, 'showDocument']);
            Route::post('pharmacy/documents/{id}', [PharmacyController::class, 'updateDocument']);
            Route::delete('pharmacy/documents/{id}', [PharmacyController::class, 'deleteDocument']);
            
            Route::get('pharmacy/dashboard/stats', [PharmacyController::class, 'dashboardStats']);
        });

        // Admin Routes
        Route::middleware('role:admin')->group(function () {
             Route::get('admin/pharmacies', [PharmacyController::class, 'adminIndex']);
             Route::get('admin/pharmacies/{id}', [PharmacyController::class, 'show']); // Reuse public show or specialized admin show
             Route::put('admin/pharmacies/{id}/approve', [PharmacyController::class, 'approve']);
             Route::put('admin/pharmacies/{id}/reject', [PharmacyController::class, 'reject']);
             Route::get('admin/pharmacies/{id}/documents', [PharmacyController::class, 'adminGetDocuments']);
             Route::get('admin/documents', [PharmacyController::class, 'adminGetAllDocuments']);
             
             Route::get('admin/reports/statistics', [ReportController::class, 'statistics']);
             Route::get('admin/reports', [ReportController::class, 'index']);
             Route::get('admin/reports/{id}', [ReportController::class, 'show']);
             Route::put('admin/reports/{id}/status', [ReportController::class, 'updateStatus']);
             
             // Admin Medicine Management
             Route::apiResource('admin/medicines', \App\Http\Controllers\Api\V1\AdminMedicineController::class);
        });
    });
});
