<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ParcelController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StaffController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('dashboard', [ParcelController::class, 'index'])
        ->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | Parcels
    |--------------------------------------------------------------------------
    */

    Route::get('parcels', [ParcelController::class, 'index'])
        ->name('parcels.index');

    Route::post('parcels', [ParcelController::class, 'store'])
        ->name('parcels.store');

    Route::put('parcels/{id}', [ParcelController::class, 'update'])
        ->name('parcels.update');

    Route::delete('parcels/{id}', [ParcelController::class, 'destroy'])
        ->name('parcels.destroy');

    Route::patch('parcels/{id}/status', [ParcelController::class, 'updateStatus'])
        ->name('parcels.updateStatus');


    /*
    |--------------------------------------------------------------------------
    | Couriers
    |--------------------------------------------------------------------------
    */

    Route::get('couriers', [CourierController::class, 'index'])
        ->name('couriers.index');

    Route::post('couriers', [CourierController::class, 'store'])
        ->name('couriers.store');

    Route::put('couriers/{id}', [CourierController::class, 'update'])
        ->name('couriers.update');

    Route::delete('couriers/{id}', [CourierController::class, 'destroy'])
        ->name('couriers.destroy');


    /*
    |--------------------------------------------------------------------------
    | Staff
    |--------------------------------------------------------------------------
    */

    Route::get('staff', [StaffController::class, 'index'])
        ->name('staff.index');

    Route::post('staff', [StaffController::class, 'store'])
        ->name('staff.store');

    Route::get('staff/{id}', [StaffController::class, 'show'])
        ->name('staff.show');

    Route::put('staff/{id}', [StaffController::class, 'update'])
        ->name('staff.update');

    Route::delete('staff/{id}', [StaffController::class, 'destroy'])
        ->name('staff.destroy');


    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::get('notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::post('notifications', [NotificationController::class, 'store'])
        ->name('notifications.store');

    Route::put('notifications/{id}', [NotificationController::class, 'update'])
        ->name('notifications.update');

    Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])
        ->name('notifications.destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';