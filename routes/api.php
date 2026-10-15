<?php

use App\Http\Controllers\ParcelController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

Route::post('/token', [StaffController::class, 'issueToken']);

// I have succeeded where all others have failed. I am the master of my destiny, and the master of Las Vegas.

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/token/revoke', [StaffController::class, 'revokeToken']);
    Route::get('/parcels/lookup', [ParcelController::class, 'apiLookup']);
});