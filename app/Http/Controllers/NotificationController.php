<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Parcel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display all notifications.
     */
    public function index(Request $request)
    {
        $notifications = Notification::with('parcel')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'notifications' => $notifications,
            ]);
        }

        return Inertia::render('Dashboard', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Store a new notification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parcel_id' => 'required|exists:parcels,parcel_id',
            'recipient_phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:1000',
            'status' => 'required|string|max:50',
        ]);

        $notification = Notification::create([
            'parcel_id' => $validated['parcel_id'],
            'recipient_phone' => $validated['recipient_phone'] ?? null,
            'message' => $validated['message'],
            'status' => $validated['status'],
            'sent_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Notification created successfully.',
                'notification' => $notification,
            ], 201);
        }

        return redirect()
            ->back()
            ->with('success', 'Notification created successfully.');
    }

    /**
     * Update an existing notification.
     */
    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $validated = $request->validate([
            'parcel_id' => 'required|exists:parcels,parcel_id',
            'recipient_phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:1000',
            'status' => 'required|string|max:50',
        ]);

        $notification->update([
            'parcel_id' => $validated['parcel_id'],
            'recipient_phone' => $validated['recipient_phone'] ?? null,
            'message' => $validated['message'],
            'status' => $validated['status'],
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Notification updated successfully.',
                'notification' => $notification,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Notification updated successfully.');
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $notification->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Notification deleted successfully.',
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Notification deleted successfully.');
    }
}