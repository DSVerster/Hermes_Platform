<?php

use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinancialReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParcelController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/auth/google/redirect', [OAuthController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [OAuthController::class, 'callback'])->name('auth.google.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('parcels/api-lookup', [ParcelController::class, 'apiLookup'])->name('parcels.api-lookup');
    Route::resource('parcels', ParcelController::class);

    Route::resource('couriers', CourierController::class);

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/{notification}', [NotificationController::class, 'show'])->name('notifications.show');
    Route::post('notifications/{notification}/resend', [NotificationController::class, 'resend'])->name('notifications.resend');

    // Financial Reports Route
    Route::get('financial-reports', [FinancialReportController::class, 'index'])->name('financial-reports');

    // Settings Route (Fixed to lowercase 'settings' to match your folder)
    Route::get('settings', function () {
        return Inertia::render('settings/Index');
    })->name('settings');

    Route::middleware('role:admin')->group(function () {
        Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
        // CREATE STAFF
        Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
        // UPDATE STAFF
        Route::put('staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
        // DELETE STAFF
        Route::delete('staff/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';