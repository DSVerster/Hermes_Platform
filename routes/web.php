<?php

use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ParcelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/auth/google/redirect', [OAuthController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [OAuthController::class, 'callback'])->name('auth.google.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('parcels', ParcelController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';