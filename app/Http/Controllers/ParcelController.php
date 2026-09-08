<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\Courier;
use App\Models\Staff;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ParcelController extends Controller
{
    /**
     * Display the dashboard and list of parcels.
     */
    public function index(Request $request)
    {
        $parcels = Parcel::with(['courier', 'staff'])
            ->orderBy('date_received', 'desc')
            ->get();

        $couriers = Courier::select('courier_id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        $staff = Staff::orderBy('name', 'asc')
            ->get();

        $notifications = Notification::orderBy('created_at', 'desc')
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'parcels' => $parcels,
                'couriers' => $couriers,
                'staff' => $staff,
                'notifications' => $notifications,
            ]);
        }

        return Inertia::render('Dashboard', [
            'parcels' => $parcels,
            'couriers' => $couriers,
            'staff' => $staff,
            'notifications' => $notifications,
        ]);
    }

    /**
     * Store a newly received parcel.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'courier_id' => 'required|exists:couriers,courier_id',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'nullable|string|max:50',
            'tracking_number' => 'required|string|max:255|unique:parcels,tracking_number',
            'parcel_type' => 'nullable|string|max:100',
            'courier_service' => 'nullable|string|max:255',
            'storage_location' => 'nullable|string|max:100',
            'collection_fee' => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated. Please log in first.',
            ], 401);
        }

        $parcel = Parcel::create([
            'courier_id' => $validated['courier_id'],
            'staff_id' => $user->staff_id,
            'recipient_name' => $validated['recipient_name'],
            'recipient_phone' => $validated['recipient_phone'] ?? null,
            'tracking_number' => $validated['tracking_number'],
            'parcel_type' => $validated['parcel_type'] ?? null,
            'courier_service' => $validated['courier_service'] ?? null,
            'storage_location' => $validated['storage_location'] ?? null,
            'collection_fee' => $validated['collection_fee'] ?? null,
            'status' => 'received',
            'date_received' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Parcel registered successfully.',
                'parcel' => $parcel,
            ], 201);
        }

        return redirect()
            ->back()
            ->with('success', 'Parcel registered successfully.');
    }

    /**
     * Update an existing parcel.
     */
    public function update(Request $request, $id)
    {
        $parcel = Parcel::findOrFail($id);

        $validated = $request->validate([
            'courier_id' => 'required|exists:couriers,courier_id',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'nullable|string|max:50',
            'tracking_number' => 'required|string|max:255|unique:parcels,tracking_number,' . $id . ',parcel_id',
            'parcel_type' => 'nullable|string|max:100',
            'courier_service' => 'nullable|string|max:255',
            'storage_location' => 'nullable|string|max:100',
            'collection_fee' => 'nullable|numeric|min:0',
        ]);

        $parcel->update([
            'courier_id' => $validated['courier_id'],
            'recipient_name' => $validated['recipient_name'],
            'recipient_phone' => $validated['recipient_phone'] ?? null,
            'tracking_number' => $validated['tracking_number'],
            'parcel_type' => $validated['parcel_type'] ?? null,
            'courier_service' => $validated['courier_service'] ?? null,
            'storage_location' => $validated['storage_location'] ?? null,
            'collection_fee' => $validated['collection_fee'] ?? null,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Parcel updated successfully.',
                'parcel' => $parcel,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Parcel updated successfully.');
    }

    /**
     * Delete a parcel.
     */
    public function destroy(Request $request, $id)
    {
        $parcel = Parcel::findOrFail($id);

        $parcel->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Parcel deleted successfully.',
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Parcel deleted successfully.');
    }

    /**
     * Update parcel status.
     */
    public function updateStatus(Request $request, $id)
    {
        $parcel = Parcel::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:received,collected,delayed',
        ]);

        $updateData = [
            'status' => $validated['status'],
        ];

        if ($validated['status'] === 'collected') {
            $updateData['date_collected'] = now();
        }

        if ($validated['status'] !== 'collected') {
            $updateData['date_collected'] = null;
        }

        $parcel->update($updateData);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Parcel status updated successfully.',
                'parcel' => $parcel,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Parcel status updated successfully.');
    }
}