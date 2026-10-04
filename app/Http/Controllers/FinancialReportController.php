<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class FinancialReportController extends Controller
{
    private const COLLECTION_FEE = 50.00;

    private function buildReport(Request $request): array
    {
        $filter = $request->input('filter', 'monthly');
        $search = $request->input('search', '');

        if ($filter === 'custom' && $request->filled(['start_date', 'end_date'])) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
        } else {
            switch ($filter) {
                case 'daily':
                    $startDate = Carbon::now()->startOfDay();
                    $endDate = Carbon::now()->endOfDay();
                    break;
                case 'quarterly':
                    $startDate = Carbon::now()->subMonths(2)->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
                case 'biannual':
                    $startDate = Carbon::now()->subMonths(5)->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
                case 'annually':
                    $startDate = Carbon::now()->subMonths(11)->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
                case 'monthly':
                default:
                    $filter = 'monthly';
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
            }
        }

        $query = Parcel::where('status', 'collected')
            ->whereBetween('date_collected', [$startDate, $endDate]);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%");
            });
        }

        $parcels = $query->orderBy('date_collected', 'desc')->get();

        $collectedCount = $parcels->count();
        $totalRevenue = $collectedCount * self::COLLECTION_FEE;

        return [
            'parcels' => $parcels,
            'totalRevenue' => $totalRevenue,
            'collectedCount' => $collectedCount,
            'feePerParcel' => self::COLLECTION_FEE,
            'filter' => $filter,
            'search' => $search,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
        ];
    }

    public function index(Request $request)
    {
        return Inertia::render('FinancialReports/Index', $this->buildReport($request));
    }

    public function exportPdf(Request $request)
    {
        $report = $this->buildReport($request);
        $report['filter'] = ucfirst($report['filter']);
        $report['dateGenerated'] = Carbon::now()->format('Y-m-d H:i:s');

        $pdf = Pdf::loadView('pdf.financial-report', $report);

        return $pdf->download('financial-report-' . $request->input('filter', 'monthly') . '-' . date('Y-m-d') . '.pdf');
    }
}