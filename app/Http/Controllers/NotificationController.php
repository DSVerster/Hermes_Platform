<?php

namespace App\Http\Controllers;

use App\Mail\ParcelReadyForCollection;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display all notifications.
     */
    public function index()
    {
        $notifications = Notification::with(
            'parcel:parcel_id,tracking_number,recipient_name,recipient_email,date_collected,status'
        )
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'title' => 'Notifications',
            'notifications' => $notifications,
        ]);
    }

    /**
     * Display a single notification.
     */
    public function show(Notification $notification)
    {
        $notification->load('parcel');

        return Inertia::render('Notifications/Show', [
            'title' => 'Notification Detail',
            'notification' => $notification,
        ]);
    }

    /**
     * Resend the notification email.
     */
    public function resend(Notification $notification)
    {
        $notification->load('parcel');

        // Make sure the notification has an associated parcel.
        if (!$notification->parcel) {
            return back()->with(
                'error',
                'The parcel associated with this notification could not be found.'
            );
        }

        // Make sure the parcel has an email address.
        if (empty($notification->parcel->recipient_email)) {
            return back()->with(
                'error',
                'This parcel does not have a recipient email address.'
            );
        }

        try {
            // Send the email to the recipient email stored on the parcel.
            Mail::to($notification->parcel->recipient_email)
                ->send(
                    new ParcelReadyForCollection($notification->parcel)
                );

            // Update the existing notification record.
            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return back()->with(
                'success',
                'Notification email sent successfully.'
            );
        } catch (\Throwable $e) {
            // Mark the notification as failed if sending fails.
            $notification->update([
                'status' => 'failed',
            ]);

            return back()->with(
                'error',
                'Failed to send notification email.'
            );
        }
    }

    /**
     * Mark the parcel associated with a notification as collected.
     */
    public function markCollected(Notification $notification)
    {
        $notification->load('parcel');

        if (!$notification->parcel) {
            return back()->with(
                'error',
                'The parcel associated with this notification could not be found.'
            );
        }

        $notification->parcel->update([
            'status' => 'collected',
            'date_collected' => now()->toDateString(),
        ]);

        return back()->with(
            'success',
            'Parcel marked as collected.'
        );
    }
}