<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // You can replace this with real data from your database
        $stats = [
            'total_parcels' => 1248,
            'pending_parcels' => 34,
            'delivered_parcels' => 1186,
            'total_customers' => 892,
        ];

        $recent_parcels = [
            ['id' => 1, 'tracking_number' => 'HER-2026-001', 'status' => 'delivered', 'customer' => 'John Smith', 'date' => '2026-09-04'],
            ['id' => 2, 'tracking_number' => 'HER-2026-002', 'status' => 'ready_for_collection', 'customer' => 'Sarah Johnson', 'date' => '2026-09-04'],
            ['id' => 3, 'tracking_number' => 'HER-2026-003', 'status' => 'received', 'customer' => 'Mike Brown', 'date' => '2026-09-03'],
            ['id' => 4, 'tracking_number' => 'HER-2026-004', 'status' => 'collected', 'customer' => 'Emily Davis', 'date' => '2026-09-03'],
            ['id' => 5, 'tracking_number' => 'HER-2026-005', 'status' => 'pending', 'customer' => 'Chris Wilson', 'date' => '2026-09-02'],
        ];

        return Inertia::render('dashboard', [
            'title' => 'Dashboard',
            'stats' => $stats,
            'recent_parcels' => $recent_parcels,
            'auth' => [
                'user' => $user ? [
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
            ],
        ]);
    }
}