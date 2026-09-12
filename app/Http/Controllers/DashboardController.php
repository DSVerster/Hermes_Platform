<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'total_parcels' => Parcel::count(),
            'pending_parcels' => Parcel::where('status', 'received')->count(),
            'ready_for_collection' => Parcel::where('status', 'ready_for_collection')->count(),
            'collected_parcels' => Parcel::where('status', 'collected')->count(),
        ];

        $recent_parcels = Parcel::orderByDesc('date_received')
            ->limit(5)
            ->get(['parcel_id', 'tracking_label', 'status', 'recipient_name', 'date_received']);

        return Inertia::render('Dashboard', [
            'title' => 'Dashboard',
            'stats' => $stats,
            'recent_parcels' => $recent_parcels,
            'auth' => [
                'user' => $user ? [
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'email' => $user->email_account,
                ] : null,
            ],
        ]);
    }
}