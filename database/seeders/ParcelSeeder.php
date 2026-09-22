<?php

namespace Database\Seeders;

use App\Models\Parcel;
use Illuminate\Database\Seeder;

class ParcelSeeder extends Seeder
{
    public function run(): void
    {
        Parcel::factory(80)->create();
    }
}