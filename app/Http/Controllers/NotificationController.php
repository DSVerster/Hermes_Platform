<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Mail\ParcelCollected;
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
     * Display successfully sent message history.
     */
    public function history()
    {
        $messages = Notification::with(
            'parcel:parcel_id,tracking_number,recipient_name,recipient_email,status,date_collected'
        )
            ->whereIn('status', ['sent', 'delivered'])
            ->orderByDesc('sent_at')
            ->paginate(20);

        return Inertia::render('Notifications/History', [
            'title' => 'Message History',
            'messages' => $messages,
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

        if (!$notification->parcel) {
            return back()->with(
                'error',
                'The parcel associated with this notification could not be found.'
            );
        }

        if (empty($notification->parcel->recipient_email)) {
            return back()->with(
                'error',
                'This parcel does not have a recipient email address.'
            );
        }

        try {
            /*
             * If this is the collection notification,
             * resend the collection confirmation email.
             */
            if (
                $notification->message ===
                'Your parcel has been collected. Thank you for doing business with us.'
            ) {
                Mail::to($notification->parcel->recipient_email)
                    ->send(
                        new ParcelCollected($notification->parcel)
                    );
            } else {
                /*
                 * Otherwise, resend the ready-for-collection email.
                 */
                Mail::to($notification->parcel->recipient_email)
                    ->send(
                        new ParcelReadyForCollection($notification->parcel)
                    );
            }

            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return back()->with(
                'success',
                'Notification email sent successfully.'
            );
        } catch (\Throwable $e) {
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
     * Mark the parcel as collected and send
     * a collection confirmation email.
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

        $parcel = $notification->parcel;

        /*
         * Check if the parcel has already been collected.
         */
        if ($parcel->status === 'collected') {
            return back()->with(
                'error',
                'This parcel has already been marked as collected.'
            );
        }

        /*
         * Update the parcel.
         */
        $parcel->update([
            'status' => 'collected',
            'date_collected' => now()->toDateString(),
        ]);

        /*
         * Send the collection confirmation email
         * if the parcel has an email address.
         */
        if (!empty($parcel->recipient_email)) {
            try {
                Mail::to($parcel->recipient_email)
                    ->send(
                        new ParcelCollected($parcel)
                    );

                /*
                 * Create a NEW notification record for
                 * the collection email.
                 */
                Notification::create([
                    'parcel_id' => $parcel->parcel_id,
                    'channel' => 'email',
                    'message' => 'Your parcel has been collected. Thank you for doing business with us.',
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (\Throwable $e) {
    /*
     * Record the actual email error in Laravel's log.
     */
    \Illuminate\Support\Facades\Log::error(
        'Hermes ParcelCollected email failed',
        [
            'parcel_id' => $parcel->parcel_id,
            'recipient_email' => $parcel->recipient_email,
            'exception' => $e->getMessage(),
        ]
    );

    /*
     * Record the failed collection email notification.
     */
    Notification::create([
        'parcel_id' => $parcel->parcel_id,
        'channel' => 'email',
        'message' => 'Your parcel has been collected. Thank you for doing business with us.',
        'status' => 'failed',
        'sent_at' => null,
    ]);

    return back()->with(
        'error',
        'Parcel was marked as collected, but the collection email could not be sent.'
    );
}

        }

        /*
         * No recipient email was provided.
         */
        if (empty($parcel->recipient_email)) {
            return back()->with(
                'success',
                'Parcel marked as collected. No recipient email address was available.'
            );
        }

        return back()->with(
            'success',
            'Parcel marked as collected and collection email sent successfully.'
        );
    }
}
