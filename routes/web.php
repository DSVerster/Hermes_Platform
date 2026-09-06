<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ParcelController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\NotificationController;

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

    // Core Parcel Workspace Stream
    Route::get('dashboard', [ParcelController::class, 'index'])->name('dashboard');

    // Backend API Logic Handlers
    Route::post('parcels', [ParcelController::class, 'store'])->name('parcels.store');
    Route::patch('parcels/{id}/status', [ParcelController::class, 'updateStatus'])->name('parcels.updateStatus');

    // Supporting Workspace Data Feeds
    Route::get('couriers', [CourierController::class, 'index'])->name('couriers.index');
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
});

// CRUCIAL: Do not forget to include these files or login/settings will stop working!
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
