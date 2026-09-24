<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Notifications/Index', [
            'title' => 'Notifications',
            'notifications' => Notification::with('parcel:parcel_id,tracking_number,recipient_name,date_collected,status')
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function show(Notification $notification)
    {
        $notification->load('parcel');

        return Inertia::render('Notifications/Show', [
            'title' => 'Notification Detail',
            'notification' => $notification,
        ]);
    }

    public function resend(Notification $notification)
    {
        $notification->update(['status' => 'pending']);
        // SendParcelNotification::dispatch($notification);

        return back()->with('success', 'Notification queued for resend.');
    }

    public function markCollected(Notification $notification)
    {
        if ($notification->parcel) {
            $notification->parcel->update([
                'status' => 'collected',
                'date_collected' => now()->toDateString(),
            ]);
        }

        return back()->with('success', 'Parcel marked as collected.');
    }
}
