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
            'parcel_id', 'tracking_number', 'status', 'recipient_name',
            'parcel_type', 'storage_location', 'date_received',
            'recipient_phone', 'courier_id', 'courier_service', 'collection_fee'
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

    public function store(StoreParcelRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();
        $validated['staff_id'] = $user->staff_id ?? $user->id ?? Staff::first()->staff_id ?? 1;
        $validated['date_received'] = now()->toDateString();
        $validated['status'] = 'received';

        $parcel = Parcel::create($validated);

        return redirect()->route('parcels.index')
            ->with('success', "Parcel {$parcel->tracking_number} logged.");
    }

    public function show($id)
    {
        $parcel = Parcel::findOrFail($id);
        return Inertia::render('Parcels/Show', [
            'title' => 'Parcel Details',
            'parcel' => $parcel->load(['courier', 'staff', 'notifications']),
        ]);
    }

    public function update(UpdateParcelRequest $request, $id)
    {
        $parcel = Parcel::findOrFail($id);
        $validated = $request->validated();

        // When status changes to collected, record the date
        if (isset($validated['status']) && $validated['status'] === 'collected' && !$parcel->date_collected) {
            $validated['date_collected'] = now()->toDateString();
        }

        $parcel->update($validated);

        return redirect()->route('parcels.index')
            ->with('success', 'Parcel updated successfully.');
    }

    public function destroy($id)
    {
        $parcel = Parcel::findOrFail($id);
        $parcel->delete();

        return redirect()->route('parcels.index')->with('success', 'Parcel deleted successfully.');
    }

    public function apiLookup(Request $request)
    {
        $request->validate(['tracking_number' => ['required', 'string']]);

        $parcel = Parcel::with('courier:courier_id,name')
            ->where('tracking_number', $request->string('tracking_number'))
            ->first();

        return response()->json([
            'found' => $parcel !== null,
            'parcel' => $parcel,
        ]);
    }
}