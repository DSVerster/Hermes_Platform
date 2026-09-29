<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Financial Report</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        }

        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
            width: 100%;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: middle;
            border: none;
            padding: 0;
        }

        .logo {
            max-height: 50px;
            width: auto;
        }

        .title-area h1 {
            margin: 0;
            font-size: 22px;
            color: #111;
        }

        .title-area p {
            margin: 5px 0 0;
            color: #666;
            font-size: 12px;
        }

        .metrics {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .metrics td {
            width: 33.33%;
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 12px;
            vertical-align: top;
        }

        .metrics h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
            color: #111;
        }

        .metrics p {
            margin: 0;
            font-size: 11px;
            color: #555;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table.data th,
        table.data td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: left;
            font-size: 12px;
        }

        table.data th {
            background-color: #f1f1f1;
            font-weight: bold;
            color: #333;
        }

        .badge {
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }

        .badge-collected {
            background: #d4edda;
            color: #155724;
        }

        .badge-received {
            background: #cce5ff;
            color: #004085;
        }
    </style>
</head>

<body>
    <div class="header">
        <table class="header-table">
            <tr>
                <td>
                    <div class="title-area">
                        <h1>Financial Reports Overview</h1>
                        <p>Period: <strong>{{ $filter }}</strong> | Search: <strong>{{ $search ?: 'None' }}</strong> | Generated: {{ $dateGenerated }}</p>
                    </div>
                </td>
                <td style="text-align: right;">
                    @php
                    $path = public_path('images/LOGO.png');
                    if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    }
                    @endphp
                    @if(isset($base64))
                    <img src="{{ $base64 }}" class="logo" alt="Logo">
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <table class="metrics">
        <tr>
            <td>
                <h3>R{{ number_format($totalRevenue, 2) }}</h3>
                <p>Total Revenue</p>
            </td>
            <td>
                <h3>R{{ number_format($pendingRevenue, 2) }}</h3>
                <p>Awaiting Collection (Received)</p>
            </td>
            <td>
                <h3>R{{ number_format($completedRevenue, 2) }}</h3>
                <p>Collected Revenue</p>
            </td>
        </tr>
    </table>

    <h4 style="margin-bottom: 5px;">Transactions ({{ $totalParcels }} records)</h4>
    <table class="data">
        <thead>
            <tr>
                <th>Tracking Number</th>
                <th>Recipient</th>
                <th>Date Received</th>
                <th>Cost</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($parcels as $parcel)
            <tr>
                <td>{{ $parcel->tracking_number }}</td>
                <td>{{ $parcel->recipient_name }}</td>
                <td>{{ \Carbon\Carbon::parse($parcel->date_received)->format('Y-m-d') }}</td>
                <td>R{{ number_format($parcel->collection_fee, 2) }}</td>
                <td>
                    <span class="badge {{ $parcel->status === 'collected' ? 'badge-collected' : 'badge-received' }}">
                        {{ ucfirst($parcel->status) }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center; color: #777;">No parcel records found for this period.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>

</html>