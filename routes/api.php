<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CondominiumController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\OwnerController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes - Authentication
Route::post('/login', [AuthController::class, 'login']);

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {

    // Authentication endpoints
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Client resources
    Route::apiResource('clients', ClientController::class);

    // Client related data (documents, folders, contracts, proposals)
    Route::prefix('clients/{client}')->group(function () {
        // Document routes
        Route::get('/documents', [DocumentController::class, 'index'])->name('api.clients.documents.index');
        Route::post('/documents', [DocumentController::class, 'upload'])->name('api.clients.documents.upload');
        Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('api.clients.documents.show');
        Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('api.clients.documents.download');
        Route::get('/documents/{document}/view', [DocumentController::class, 'view'])->name('api.clients.documents.view');
        Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('api.clients.documents.destroy');

        // Folder routes
        Route::get('/folders', [FolderController::class, 'index'])->name('api.clients.folders.index');
        Route::post('/folders', [FolderController::class, 'store'])->name('api.clients.folders.store');
        Route::get('/folders/{folder}', [FolderController::class, 'show'])->name('api.clients.folders.show');
        Route::delete('/folders/{folder}', [FolderController::class, 'destroy'])->name('api.clients.folders.destroy');

        // Contract routes
        Route::get('/contracts', [ClientController::class, 'contracts'])->name('api.clients.contracts');

        // Proposal routes
        Route::get('/proposals', [ClientController::class, 'proposals'])->name('api.clients.proposals');
    });

    // Owner resources
    Route::apiResource('owners', OwnerController::class);

    // Supplier resources
    Route::apiResource('suppliers', SupplierController::class);

    // Condominium resources
    Route::apiResource('condominiums', CondominiumController::class);

    // Property resources
    Route::apiResource('properties', PropertyController::class);

    // Room resources
    Route::apiResource('rooms', RoomController::class);

    // Proposal resources
    Route::apiResource('proposals', ProposalController::class);

    // Contract resources
    Route::apiResource('contracts', ContractController::class);

    // Calendar routes
    Route::prefix('calendar')->group(function () {
        Route::get('/events', [CalendarController::class, 'getAllEvents']);

        // Maintenance routes
        Route::post('/maintenance', [CalendarController::class, 'storeMaintenance']);
        Route::put('/maintenance/{id}', [CalendarController::class, 'updateMaintenance']);
        Route::delete('/maintenance/{id}', [CalendarController::class, 'deleteMaintenance']);

        // Check-in routes
        Route::post('/checkin', [CalendarController::class, 'storeCheckin']);
        Route::put('/checkin/{id}', [CalendarController::class, 'updateCheckin']);
        Route::delete('/checkin/{id}', [CalendarController::class, 'deleteCheckin']);

        // Check-out routes
        Route::post('/checkout', [CalendarController::class, 'storeCheckout']);
        Route::put('/checkout/{id}', [CalendarController::class, 'updateCheckout']);
        Route::delete('/checkout/{id}', [CalendarController::class, 'deleteCheckout']);

        // Report routes
        Route::post('/report', [CalendarController::class, 'storeReport']);
        Route::put('/report/{id}', [CalendarController::class, 'updateReport']);
        Route::delete('/report/{id}', [CalendarController::class, 'deleteReport']);
    });

    // Legacy user endpoint (for backward compatibility)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
