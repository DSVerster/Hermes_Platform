<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
<<<<<<< HEAD
use App\Models\Courier;
use App\Models\Staff;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ParcelController extends Controller
{
    /**
     * Display a listing of the parcels along with select systems dependencies.
     */
    public function index()
    {
        $parcels = Parcel::orderBy('date_received', 'desc')
            ->get(['parcel_id', 'tracking_label', 'status', 'recipient_name', 'parcel_type', 'storage_location', 'date_received']);

        $couriers = Courier::all(['courier_id', 'name']);
        $staffs = Staff::all(['staff_id', 'name', 'surname']);
=======
use Inertia\Inertia;

class ParcelController extends Controller
{
    public function index()
    {
        $parcels = Parcel::orderBy('received_at', 'desc')
            ->get(['id', 'tracking_number', 'status']);
>>>>>>> c4faf9af31407980159f0789ffe960231b04ea6f

        return Inertia::render('Parcels/Index', [
            'title' => 'Parcels',
            'parcels' => $parcels,
<<<<<<< HEAD
            'couriers' => $couriers,
            'staffs' => $staffs,
        ]);
    }

    /**
     * Store a newly created parcel inside the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tracking_label'   => 'required|string|unique:parcels,tracking_label',
            'recipient_name'   => 'required|string',
            'recipient_phone'  => 'required|string',
            'parcel_type'      => 'required|string',
            'storage_location' => 'required|string',
            'status'           => 'required|string',
            'courier_id'       => 'required|integer|exists:couriers,courier_id',
            'staff_id'         => 'required|integer|exists:staff,staff_id', // Fixed: staffs changed to staff
        ]);

        $validated['date_received'] = now()->toDateString();

        Parcel::create($validated);

        return redirect()->route('parcels.index')->with('success', 'Parcel created successfully.');
    }

    /**
     * Display detailed data for a singular parcel record.
     */
=======
        ]);
    }

>>>>>>> c4faf9af31407980159f0789ffe960231b04ea6f
    public function show(Parcel $parcel)
    {
        return Inertia::render('Parcels/Show', [
            'title' => 'Parcel Details',
<<<<<<< HEAD
            'parcel' => $parcel->load(['courier', 'staff']),
        ]);
    }

    /**
     * Update the specified parcel structural data.
     */
    public function update(Request $request, Parcel $parcel)
    {
        $validated = $request->validate([
            'tracking_label'   => 'required|string|unique:parcels,tracking_label,' . $parcel->parcel_id . ',parcel_id',
            'recipient_name'   => 'required|string',
            'recipient_phone'  => 'required|string',
            'parcel_type'      => 'required|string',
            'storage_location' => 'required|string',
            'status'           => 'required|string',
            'courier_id'       => 'required|integer|exists:couriers,courier_id',
            'staff_id'         => 'required|integer|exists:staff,staff_id', // Fixed: staffs changed to staff
            'date_collected'   => 'nullable|date',
        ]);

        if ($validated['status'] === 'collected' && !$parcel->date_collected) {
            $validated['date_collected'] = now()->toDateString();
        }

        $parcel->update($validated);

        return redirect()->route('parcels.index')->with('success', 'Parcel updated successfully.');
    }

    /**
     * Wipe a specific parcel tracking listing completely from database history.
     */
    public function destroy(Parcel $parcel)
    {
        $parcel->delete();

        return redirect()->route('parcels.index')->with('success', 'Parcel deleted successfully.');
    }
}
=======
            'parcel' => $parcel,
        ]);
    }
}
>>>>>>> c4faf9af31407980159f0789ffe960231b04ea6f
