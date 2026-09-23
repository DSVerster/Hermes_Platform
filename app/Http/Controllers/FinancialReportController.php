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
        $filter = $request->input('filter', 'monthly'); // monthly, 6months, annually
        $search = $request->input('search', '');

        // Determine date range based on filter
        $startDate = match($filter) {
            'monthly' => Carbon::now()->startOfMonth(),
            '6months' => Carbon::now()->subMonths(6)->startOfMonth(),
            'annually' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };

        $endDate = Carbon::now()->endOfDay();

        // Base query for parcels within date range
        $query = Parcel::whereBetween('created_at', [$startDate, $endDate]);

        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('recipient_name', 'like', "%{$search}%")
                  ->orWhere('collection_fee', 'like', "%{$search}%");
            });
        }

        $parcels = $query->orderBy('created_at', 'desc')->get();

        // Calculate financial summaries
        $totalRevenue = $parcels->sum('collection_fee');
        $pendingRevenue = $parcels->where('status', 'pending')->sum('collection_fee');
        $completedRevenue = $parcels->where('status', 'collected')->sum('collection_fee');

        return Inertia::render('FinancialReports/Index', [
            'parcels' => $parcels,
            'totalRevenue' => $totalRevenue,
            'pendingRevenue' => $pendingRevenue,
            'completedRevenue' => $completedRevenue,
            'filter' => $filter,
            'search' => $search,
            'totalParcels' => $parcels->count(),
            'pendingCount' => $parcels->where('status', 'pending')->count(),
            'completedCount' => $parcels->where('status', 'collected')->count(),
        ]);
    }
}