<?php
namespace App\Http\Controllers;

use App\Models\Parcel;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalParcels = Parcel::count();
        $receivedCount = Parcel::where('status', 'received')->count();
        $collectedCount = Parcel::where('status', 'collected')->count();

        // Build 7-day chart data (received vs collected per day)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $label = Carbon::now()->subDays($i)->format('M d');

            $received = Parcel::where('status', 'received')
                ->whereDate('date_received', $date)
                ->count();

            $collected = Parcel::where('status', 'collected')
                ->whereDate('date_collected', $date)
                ->count();

            $chartData[] = [
                'date' => $label,
                'received' => $received,
                'collected' => $collected,
            ];
        }

        // Recent parcels for the list
        $recentParcels = Parcel::with('courier')
            ->orderBy('date_received', 'desc')
            ->take(5)
            ->get(['parcel_id', 'tracking_number', 'status', 'recipient_name', 'date_received']);

        return Inertia::render('Dashboard/Index', [
            'title' => 'Dashboard',
            'totalParcels' => $totalParcels,
            'receivedCount' => $receivedCount,
            'collectedCount' => $collectedCount,
            'chartData' => $chartData,
            'recentParcels' => $recentParcels,
        ]);
    }
}