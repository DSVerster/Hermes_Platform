<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\Courier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ParcelController extends Controller
{
    /**
     * Display a listing of parcels.
     */
    public function index()
    {
        $parcels = Parcel::with(['courier', 'staff'])->orderBy('date_received', 'desc')->get();
        $couriers = Courier::select('courier_id', 'name')->get();

        return Inertia::render('Dashboard', [
            'parcels' => $parcels,
            'couriers' => $couriers
        ]);
    }

    /**
     * Store a newly received parcel in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'courier_id'       => 'required|exists:couriers,courier_id', // Plural matching your screenshot
            'recipient_name'   => 'required|string|max:255',
            'recipient_phone'  => 'nullable|string|max:50',
            'tracking_number'  => 'required|string|max:255|unique:parcels,tracking_number', // Plural matching your screenshot
            'parcel_type'      => 'nullable|string|max:100',
            'courier_service'  => 'nullable|string|max:255',
            'storage_location' => 'nullable|string|max:100',
            'collection_fee'   => 'nullable|numeric|min:0',
        ]);

        /** @var \App\Models\Staff $user */
        $user = Auth::user();

        Parcel::create(array_merge($validated, [
            'staff_id'      => $user->staff_id,
            'status'        => 'received',
            'date_received' => now(),
        ]));

        return redirect()->back()->with('success', 'Parcel registered successfully.');
    }

    /**
     * Update the status of a parcel.
     */
    public function updateStatus(Request $request, $id)
    {
        $parcel = Parcel::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:received,collected,delayed',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'collected') {
            $updateData['date_collected'] = now();
        }

        $parcel->update($updateData);

        return redirect()->back()->with('success', 'Parcel status updated.');
    }
}
