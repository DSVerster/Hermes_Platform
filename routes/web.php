<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ParcelController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StaffController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Welcome Landing Page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


// Authenticated & Verified Dashboard Access Routes
Route::middleware(['auth', 'verified'])->group(function () {

    // =========================
    // DASHBOARD
    // =========================

    Route::get('dashboard', [ParcelController::class, 'index'])
        ->name('dashboard');


    // =========================
    // PARCEL ROUTES
    // =========================

    // Get parcels
    Route::get('parcels', [ParcelController::class, 'index'])
        ->name('parcels.index');

    // Create parcel
    Route::post('parcels', [ParcelController::class, 'store'])
        ->name('parcels.store');

    // Update parcel status
    Route::patch('parcels/{id}/status', [ParcelController::class, 'updateStatus'])
        ->name('parcels.updateStatus');


    // =========================
    // COURIER ROUTES
    // =========================

    // Get all couriers
    Route::get('couriers', [CourierController::class, 'index'])
        ->name('couriers.index');


    // =========================
    // NOTIFICATION ROUTES
    // =========================

    // Get all notifications
    Route::get('notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');


    // =========================
    // STAFF ROUTES
    // =========================

    // Get all staff
    Route::get('staff', [StaffController::class, 'index'])
        ->name('staff.index');

    // Create staff
    Route::post('staff', [StaffController::class, 'store'])
        ->name('staff.store');

    // Get one staff member
    Route::get('staff/{id}', [StaffController::class, 'show'])
        ->name('staff.show');

    // Update staff
    Route::put('staff/{id}', [StaffController::class, 'update'])
        ->name('staff.update');

    // Delete staff
    Route::delete('staff/{id}', [StaffController::class, 'destroy'])
        ->name('staff.destroy');
});


// =========================
// AUTHENTICATION & SETTINGS
// =========================

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
