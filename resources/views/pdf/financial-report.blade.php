<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Financial Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 120px; margin-bottom: 15px; }
        h1 { margin: 0; font-size: 22px; color: #1a202c; }
        .meta { margin-top: 10px; font-size: 11px; color: #666; }
        .stats-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
        .stats-table td { border: 1px solid #e2e8f0; padding: 15px; text-align: center; width: 33.33%; background-color: #f8fafc; }
        .stats-value { font-size: 20px; font-weight: bold; color: #2d3748; margin-bottom: 5px; }
        .stats-label { font-size: 11px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; }
        h3 { font-size: 16px; color: #2d3748; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background-color: #f7fafc; color: #4a5568; padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; }
        .data-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        .status-badge { background-color: #c6f6d5; color: #22543d; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; }
    </style>
</head>
<body>

    <div class="header">
        @php
            $path = public_path('images/LOGO.png');
            $base64 = '';
            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            }
        @endphp
        
        @if($base64)
            <img src="{{ $base64 }}" class="logo" alt="Hermes Platform Logo">
        @endif

        <h1>Financial Reports Overview</h1>
        <div class="meta">
            <p>Period: {{ ucfirst($filter) }} ({{ \Carbon\Carbon::parse($startDate)->format('Y-m-d') }} to {{ \Carbon\Carbon::parse($endDate)->format('Y-m-d') }})</p>
            <p>Search: {{ $search ?: 'None' }} | Generated: {{ $dateGenerated }}</p>
        </div>
    </div>

    <table class="stats-table">
        <tr>
            <td>
                <div class="stats-value">R{{ number_format($totalRevenue, 2) }}</div>
                <div class="stats-label">Total Revenue</div>
            </td>
            <td>
                <div class="stats-value">{{ $collectedCount }}</div>
                <div class="stats-label">Packages Collected</div>
            </td>
            <td>
                <div class="stats-value">R{{ number_format($feePerParcel, 2) }}</div>
                <div class="stats-label">Avg Fee Per Parcel</div>
            </td>
        </tr>
    </table>

    <h3>Collected Parcels ({{ $collectedCount }} records)</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Tracking Number</th>
                <th>Recipient</th>
                <th>Date Collected</th>
                <th>Fee</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($parcels as $parcel)
            <tr>
                <td>{{ $parcel->tracking_number }}</td>
                <td>{{ $parcel->recipient_name }}</td>
                <td>{{ \Carbon\Carbon::parse($parcel->date_collected)->format('Y-m-d') }}</td>
                <td>R{{ number_format($parcel->collection_fee, 2) }}</td>
                <td><span class="status-badge">Collected</span></td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #718096;">
                    No collected parcels found for this period.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>