<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Existing Stats
        $totalParcels = Parcel::count();
        $receivedCount = Parcel::where('status', 'received')->count();
        $collectedCount = Parcel::where('status', 'collected')->count();

        // Existing Chart Data (Last 7 Days)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $label = Carbon::now()->subDays($i)->format('M d');
            
            $received = Parcel::whereDate('date_received', $date)->count();
            $collected = Parcel::where('status', 'collected')
                ->whereDate('date_collected', $date)
                ->count();
                
            $chartData[] = [
                'date' => $label,
                'received' => $received,
                'collected' => $collected,
            ];
        }

        // Existing Recent Parcels
        $recentParcels = Parcel::with('courier')
            ->orderBy('date_received', 'desc')
            ->take(5)
            ->get(['parcel_id', 'tracking_number', 'status', 'recipient_name', 'date_received']);

        // NEW: Generate Collection Forecast (SQLite Compatible)
        $collectionForecast = $this->generateCollectionForecast();

        return Inertia::render('Dashboard/Index', [
            'title' => 'Dashboard',
            'totalParcels' => $totalParcels,
            'receivedCount' => $receivedCount,
            'collectedCount' => $collectedCount,
            'chartData' => $chartData,
            'recentParcels' => $recentParcels,
            'collectionForecast' => $collectionForecast,
        ]);
    }

    /**
     * DSS Logic: Predicts collection volume for next 7 days
     * Uses PHP Carbon instead of SQL DAYNAME() for SQLite compatibility
     */
    private function generateCollectionForecast(): array
    {
        // Get all collected parcels from last 30 days
        $parcels = Parcel::where('status', 'collected')
            ->whereNotNull('date_collected')
            ->whereBetween('date_collected', [
                Carbon::now()->subDays(30),
                Carbon::now()
            ])
            ->get(['date_collected']);

        // Group by day of week using PHP
        $dayCounts = [];
        foreach ($parcels as $parcel) {
            $dayName = Carbon::parse($parcel->date_collected)->format('l'); // e.g., "Monday"
            if (!isset($dayCounts[$dayName])) {
                $dayCounts[$dayName] = 0;
            }
            $dayCounts[$dayName]++;
        }

        // Calculate averages (approx 4.3 weeks in 30 days)
        $dayAverages = [];
        foreach ($dayCounts as $day => $count) {
            $dayAverages[$day] = $count / 4.3;
        }

        $forecast = [];
        $today = Carbon::now();
        
        // Find overall average to determine "peak" threshold
        $overallAvg = !empty($dayAverages) ? array_sum($dayAverages) / count($dayAverages) : 0;
        $peakThreshold = $overallAvg * 1.2; // 20% above average is a peak

        for ($i = 0; $i < 7; $i++) {
            $date = $today->copy()->addDays($i);
            $dayName = $date->format('l'); 
            
            // Base prediction from historical average
            $basePrediction = $dayAverages[$dayName] ?? 0;
            
            // Simple trend adjustment
            $adjustment = match($date->dayOfWeek) {
                0, 6 => 1.05, // Weekend slight boost
                1 => 0.95,    // Monday slight dip
                default => 1.0
            };
            
            $predicted = max(0, round($basePrediction * $adjustment));
            
            $forecast[] = [
                'date' => $date->format('M d'),
                'day_name' => $dayName,
                'predicted_collections' => $predicted,
                'is_peak' => $predicted > $peakThreshold && $overallAvg > 0,
                'confidence' => min(95, 65 + ($i * 4)),
            ];
        }

        return $forecast;
    }
}