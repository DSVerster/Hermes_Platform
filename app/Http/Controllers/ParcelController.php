<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParcelRequest;
use App\Http\Requests\UpdateParcelRequest;
use App\Mail\ParcelReadyForCollection;
use App\Models\Courier;
use App\Models\Notification;
use App\Models\Parcel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ParcelController extends Controller
{
    public function index(Request $request)
    {
        $query = Parcel::with(['courier', 'staff'])->latest('created_at');

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

        $sendEmail = $request->boolean('send_email');

        unset($validated['send_email']);

        $validated['staff_id'] = Auth::id();
        $validated['collection_fee'] = 10.00;

        $parcel = Parcel::create($validated);

        if ($sendEmail && !empty($parcel->recipient_email)) {
            $notification = Notification::create([
                'parcel_id' => $parcel->parcel_id,
                'channel' => 'email',
                'message' => 'Your parcel order has been created successfully. We will communicate with you when it is ready for collection.',
                'status' => 'pending',
            ]);

            try {
                Mail::to($parcel->recipient_email)
                    ->send(new ParcelReadyForCollection($parcel));

                $notification->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (\Throwable $e) {
                $notification->update([
                    'status' => 'failed',
                ]);
            }
        }

        return redirect()
            ->route('parcels.index')
            ->with('success', 'Parcel created successfully.');
    }

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

    public function update(UpdateParcelRequest $request, Parcel $parcel)
    {
        $validated = $request->validated();

        $parcel->update($validated);

        return redirect()
            ->route('parcels.index')
            ->with('success', 'Parcel updated successfully.');
    }

    public function destroy(Parcel $parcel)
    {
        $parcel->delete();

        return redirect()
            ->route('parcels.index')
            ->with('success', 'Parcel deleted successfully.');
    }

    public function apiLookup(Request $request)
    {
        return response()->json([
            'message' => 'API lookup endpoint',
        ]);
    }
}
