<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CondominiumController;
use App\Http\Controllers\Api\CondominiumDocumentController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\OwnerController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyDocumentController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomDocumentController;
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

    // Room related data (documents, folders, contracts, proposals)
    Route::prefix('rooms/{room}')->group(function () {
        // Document routes
        Route::get('/documents', [RoomDocumentController::class, 'index']);
        Route::post('/documents', [RoomDocumentController::class, 'store']);
        Route::get('/documents/{document}', [RoomDocumentController::class, 'show']);
        Route::get('/documents/{document}/download', [RoomDocumentController::class, 'download']);
        Route::get('/documents/{document}/view', [RoomDocumentController::class, 'view']);
        Route::delete('/documents/{document}', [RoomDocumentController::class, 'destroy']);

        // Folder routes
        Route::get('/folders', [RoomDocumentController::class, 'indexFolders']);
        Route::post('/folders', [RoomDocumentController::class, 'storeFolder']);
        Route::get('/folders/{folder}', [RoomDocumentController::class, 'showFolder']);
        Route::delete('/folders/{folder}', [RoomDocumentController::class, 'destroyFolder']);

        // Contract routes
        Route::get('/contracts', [RoomController::class, 'contracts']);

        // Proposal routes
        Route::get('/proposals', [RoomController::class, 'proposals']);
    });

    // Property resources
    Route::apiResource('properties', PropertyController::class);

    // Property related data (documents, folders, contracts, proposals)
    Route::prefix('properties/{property}')->group(function () {
        // Document routes
        Route::get('/documents', [PropertyDocumentController::class, 'index']);
        Route::post('/documents', [PropertyDocumentController::class, 'store']);
        Route::get('/documents/{document}', [PropertyDocumentController::class, 'show']);
        Route::get('/documents/{document}/download', [PropertyDocumentController::class, 'download']);
        Route::get('/documents/{document}/view', [PropertyDocumentController::class, 'view']);
        Route::delete('/documents/{document}', [PropertyDocumentController::class, 'destroy']);

        // Folder routes
        Route::get('/folders', [PropertyDocumentController::class, 'indexFolders']);
        Route::post('/folders', [PropertyDocumentController::class, 'storeFolder']);
        Route::get('/folders/{folder}', [PropertyDocumentController::class, 'showFolder']);
        Route::delete('/folders/{folder}', [PropertyDocumentController::class, 'destroyFolder']);

        // Contract routes
        Route::get('/contracts', [PropertyController::class, 'contracts']);

        // Proposal routes
        Route::get('/proposals', [PropertyController::class, 'proposals']);
    });

    // Condominium resources
    Route::apiResource('condominiums', CondominiumController::class);

    // Condominium related data (documents, folders)
    Route::prefix('condominiums/{condominium}')->group(function () {
        // Document routes
        Route::get('/documents', [CondominiumDocumentController::class, 'index']);
        Route::post('/documents', [CondominiumDocumentController::class, 'store']);
        Route::get('/documents/{document}', [CondominiumDocumentController::class, 'show']);
        Route::get('/documents/{document}/download', [CondominiumDocumentController::class, 'download']);
        Route::get('/documents/{document}/view', [CondominiumDocumentController::class, 'view']);
        Route::delete('/documents/{document}', [CondominiumDocumentController::class, 'destroy']);

        // Folder routes
        Route::get('/folders', [CondominiumDocumentController::class, 'indexFolders']);
        Route::post('/folders', [CondominiumDocumentController::class, 'storeFolder']);
        Route::get('/folders/{folder}', [CondominiumDocumentController::class, 'showFolder']);
        Route::delete('/folders/{folder}', [CondominiumDocumentController::class, 'destroyFolder']);
    });

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
