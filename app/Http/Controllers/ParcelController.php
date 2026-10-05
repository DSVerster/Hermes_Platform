<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParcelRequest;
use App\Http\Requests\UpdateParcelRequest;
use App\Models\Courier;
use App\Models\Parcel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ParcelController extends Controller
{
    public function index(Request $request)
    {
        $query = Parcel::with(['courier', 'staff'])->latest('date_received');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('recipient_name', 'like', "%{$search}%");
            });
        }

        $parcels = $query->get();

        return Inertia::render('Parcels/Index', [
            'parcels' => $parcels,
            'couriers' => Courier::all(),
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Parcels/Create', [
            'couriers' => Courier::all(),
        ]);
    }

    public function store(StoreParcelRequest $request)
    {
        $validated = $request->validated();
        $validated['staff_id'] = Auth::id(); // Assuming Auth::id() returns staff_id based on your auth setup

        Parcel::create($validated);

        return redirect()->route('parcels.index')->with('success', 'Parcel created successfully.');
    }

    // FIX: Changed from $id to implicit model binding $parcel
    public function show(Parcel $parcel)
    {
        $parcel->load(['courier', 'staff', 'notifications']);

        return Inertia::render('Parcels/Show', [
            'parcel' => $parcel,
        ]);
    }

    public function edit(Parcel $parcel)
    {
        return Inertia::render('Parcels/Edit', [
            'parcel' => $parcel,
            'couriers' => Courier::all(),
        ]);
    }

    // FIX: Changed from $id to implicit model binding $parcel
    public function update(UpdateParcelRequest $request, Parcel $parcel)
    {
        $validated = $request->validated();
        $parcel->update($validated);

        return redirect()->route('parcels.index')->with('success', 'Parcel updated successfully.');
    }

    // FIX: Changed from $id to implicit model binding $parcel
    public function destroy(Parcel $parcel)
    {
        $parcel->delete();

        return redirect()->route('parcels.index')->with('success', 'Parcel deleted successfully.');
    }

    public function apiLookup(Request $request)
    {
        // Your existing API lookup logic
        return response()->json(['message' => 'API lookup endpoint']);
    }
}