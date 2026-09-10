<?php

namespace Database\Seeders;

use App\Models\Parcel;
use Illuminate\Database\Seeder;

class ParcelSeeder extends Seeder
{
    public function run(): void
    {
        Parcel::create([
            'tracking_number' => 'HER-2026-001',
            'status' => 'received',
            'received_at' => now(),
        ]);
        
        Parcel::create([
            'tracking_number' => 'HER-2026-002',
            'status' => 'ready_for_collection',
            'received_at' => now()->subDay(),
        ]);
        
        Parcel::create([
            'tracking_number' => 'HER-2026-003',
            'status' => 'collected',
            'received_at' => now()->subDays(2),
        ]);
    }
}