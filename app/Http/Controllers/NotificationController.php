<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications.
     */
    public function index(Request $request)
    {
        $notifications = Notification::with('parcel')->orderBy('created_at', 'desc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'notifications' => $notifications
            ]);
        }

        return response()->json(['notifications' => $notifications]);
    }
}
