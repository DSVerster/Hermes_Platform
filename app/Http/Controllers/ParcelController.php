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
     * Display a listing of the parcels along with search filtering.
     **/
    public function index(Request $request)
    {
        $search = $request->input('search');

        $parcels = Parcel::when($search, function ($query, $search) {
            $query->where('tracking_number', 'like', "%{$search}%")
                ->orWhere('recipient_name', 'like', "%{$search}%")
                ->orWhere('status', 'like', "%{$search}%")
                ->orWhere('parcel_type', 'like', "%{$search}%");
        })
            ->orderBy('date_received', 'desc')
            ->get([
                'parcel_id',
                'tracking_number',
                'status',
                'recipient_name',
                'parcel_type',
                'storage_location',
                'date_received',
                'recipient_phone',
                'courier_id',
                'courier_service',
                'collection_fee'
            ]);

        $couriers = Courier::all(['courier_id', 'name']);
        $staffs = Staff::all(['staff_id', 'name', 'surname']);

        return Inertia::render('Parcels/Index', [
            'title' => 'Parcels',
            'parcels' => $parcels,
            'filters' => $request->only(['search']),
            'couriers' => $couriers,
            'staffs' => $staffs,
        ]);
    }

    /**
     * Store a newly created parcel inside the database.
     **/
    public function store(StoreParcelRequest $request)
    {
        $validated = $request->validated();

        // Safety Fallback: Use logged-in staff id or default to the first available staff record
        $user = $request->user();
        $validated['staff_id'] = $user->staff_id ?? $user->id ?? Staff::first()->staff_id ?? 1;

        $validated['date_received'] = now()->toDateString();

        // Force the incoming status to remain received initially
        $validated['status'] = $validated['status'] ?? 'received';

        $parcel = Parcel::create($validated);

        return redirect()->route('parcels.index')
            ->with('success', "Parcel {$parcel->tracking_number} logged.");
    }

    /**
     * Display detailed data for a singular parcel record.
     **/
    public function show($id)
    {
        $parcel = Parcel::findOrFail($id);
        return Inertia::render('Parcels/Show', [
            'title' => 'Parcel Details',
            'parcel' => $parcel->load(['courier', 'staff', 'notifications']),
        ]);
    }

    /**
     * Update the specified parcel structural data.
     **/
    public function update(UpdateParcelRequest $request, $id)
    {
        // Explicitly load the parcel record using the primary key ID string
        $parcel = Parcel::findOrFail($id);
        $validated = $request->validated();

        $wasReady = $parcel->status === 'ready_for_collection';

        if (isset($validated['status']) && $validated['status'] === 'collected' && !$parcel->date_collected) {
            $validated['date_collected'] = now()->toDateString();
        }

        $parcel->update($validated);

        if (!$wasReady && isset($validated['status']) && $validated['status'] === 'ready_for_collection') {
            Notification::create([
                'parcel_id' => $parcel->parcel_id,
                'channel' => 'sms',
                'message' => "Hi {$parcel->recipient_name}, your parcel "
                    . "({$parcel->tracking_number}) is ready for collection.",
                'status' => 'pending',
            ]);
        }

        return redirect()->route('parcels.index')
            ->with('success', 'Parcel updated successfully.');
    }

    /**
     * Wipe a specific parcel tracking listing completely from database history.
     **/
    public function destroy($id)
    {
        $parcel = Parcel::findOrFail($id);
        $parcel->delete();
        return redirect()->route('parcels.index')->with('success', 'Parcel deleted successfully.');
    }

    /**
     * Look up a parcel by tracking number for non-browser API clients.
     **/
    public function apiLookup(Request $request)
    {
        $request->validate(['tracking_number' => ['required', 'string']]);
        $parcel = Parcel::with('courier:courier_id,name')
            ->where('tracking_number', $request->string('tracking_number'))
            ->firstOrFail();

        return response()->json($parcel);
    }
}
