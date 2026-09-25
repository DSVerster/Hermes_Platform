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

        $startDate = match($filter) {
            'monthly' => Carbon::now()->startOfMonth(),
            '6months' => Carbon::now()->subMonths(6)->startOfMonth(),
            'annually' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };
        $endDate = Carbon::now()->endOfDay();

        $query = Parcel::whereBetween('created_at', [$startDate, $endDate]);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('recipient_name', 'like', "%{$search}%")
                  ->orWhere('collection_fee', 'like', "%{$search}%");
            });
        }

        $parcels = $query->orderBy('created_at', 'desc')->get();

        $totalRevenue = $parcels->sum('collection_fee');
        $receivedRevenue = $parcels->where('status', 'received')->sum('collection_fee');
        $completedRevenue = $parcels->where('status', 'collected')->sum('collection_fee');

        return Inertia::render('FinancialReports/Index', [
            'parcels' => $parcels,
            'totalRevenue' => $totalRevenue,
            'pendingRevenue' => $receivedRevenue,
            'completedRevenue' => $completedRevenue,
            'filter' => $filter,
            'search' => $search,
            'totalParcels' => $parcels->count(),
            'pendingCount' => $parcels->where('status', 'received')->count(),
            'completedCount' => $parcels->where('status', 'collected')->count(),
        ]);
    }
}