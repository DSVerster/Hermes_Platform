<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class FinancialReportController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->input('filter', 'monthly');
        $search = $request->input('search', '');

        /*
        |--------------------------------------------------------------------------
        | Determine reporting period
        |--------------------------------------------------------------------------
        */

        switch ($filter) {
            case 'monthly':
                // Current month
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;

            case '6months':
                // Last 6 months including the current month
                $startDate = Carbon::now()->subMonths(5)->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;

            case 'annually':
                // Last 12 months including the current month
                $startDate = Carbon::now()->subMonths(11)->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;

            default:
                // Default to current month
                $filter = 'monthly';
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;
        }

        /*
        |--------------------------------------------------------------------------
        | Get parcels within selected period
        |--------------------------------------------------------------------------
        */

        $query = Parcel::whereBetween(
            'date_received',
            [$startDate, $endDate]
        );

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('collection_fee', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Retrieve parcels
        |--------------------------------------------------------------------------
        */

        $parcels = $query
            ->orderBy('date_received', 'desc')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Calculate revenue
        |--------------------------------------------------------------------------
        */

        $totalRevenue = $parcels->sum('collection_fee');

        $receivedRevenue = $parcels
            ->where('status', 'received')
            ->sum('collection_fee');

        $completedRevenue = $parcels
            ->where('status', 'collected')
            ->sum('collection_fee');

        /*
        |--------------------------------------------------------------------------
        | Return Financial Reports page
        |--------------------------------------------------------------------------
        */

        return Inertia::render('FinancialReports/Index', [
            'parcels' => $parcels,

            'totalRevenue' => $totalRevenue,

            'pendingRevenue' => $receivedRevenue,

            'completedRevenue' => $completedRevenue,

            'filter' => $filter,

            'search' => $search,

            'totalParcels' => $parcels->count(),

            'pendingCount' => $parcels
                ->where('status', 'received')
                ->count(),

            'completedCount' => $parcels
                ->where('status', 'collected')
                ->count(),
        ]);
    }
}
