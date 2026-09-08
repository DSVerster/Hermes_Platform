<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use Inertia\Inertia;

class ParcelController extends Controller
{
    public function index()
    {
        $parcels = Parcel::orderBy('received_at', 'desc')
            ->get(['id', 'tracking_number', 'status']);

        return Inertia::render('Parcels/Index', [
            'title' => 'Parcels',
            'parcels' => $parcels,
        ]);
    }

    public function show(Parcel $parcel)
    {
        return Inertia::render('Parcels/Show', [
            'title' => 'Parcel Details',
            'parcel' => $parcel,
        ]);
    }
}