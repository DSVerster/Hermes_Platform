<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\Courier;
use App\Models\Staff;
use App\Models\Notification;
use App\Http\Requests\StoreParcelRequest;
use App\Http\Requests\UpdateParcelRequest;
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

        return Inertia::render('Parcels/Index', [
            'title' => 'Parcels',
            'parcels' => $parcels,
            'couriers' => $couriers,
            'staffs' => $staffs,
        ]);
    }

    /**
     * Store a newly created parcel inside the database.
     */
    public function store(StoreParcelRequest $request)
    {
        $validated = $request->validated();
        $validated['staff_id'] = $request->user()->staff_id;
        $validated['date_received'] = now()->toDateString();

        $parcel = Parcel::create($validated);

        return redirect()->route('parcels.show', $parcel)
            ->with('success', "Parcel {$parcel->tracking_label} logged.");
    }

    /**
     * Display detailed data for a singular parcel record.
     */
    public function show(Parcel $parcel)
    {
        return Inertia::render('Parcels/Show', [
            'title' => 'Parcel Details',
            'parcel' => $parcel->load(['courier', 'staff', 'notifications']),
        ]);
    }

    /**
     * Update the specified parcel structural data.
     */
    public function update(UpdateParcelRequest $request, Parcel $parcel)
    {
        $validated = $request->validated();

        $wasReady = $parcel->status === 'ready_for_collection';

        if ($validated['status'] === 'collected' && !$parcel->date_collected) {
            $validated['date_collected'] = now()->toDateString();
        }

        $parcel->update($validated);

        // Fire the one and only notification trigger: the moment a parcel
        // first becomes ready for collection. Re-saving an already-ready
        // parcel must never send a second SMS.
        if (!$wasReady && $parcel->status === 'ready_for_collection') {
            Notification::create([
                'parcel_id' => $parcel->parcel_id,
                'channel' => 'sms',
                'message' => "Hi {$parcel->recipient_name}, your parcel "
                    ."({$parcel->tracking_label}) is ready for collection.",
                'status' => 'pending',
            ]);
        }

        return redirect()->route('parcels.show', $parcel)
            ->with('success', 'Parcel updated successfully.');
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