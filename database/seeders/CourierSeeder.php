<?php

namespace Database\Seeders;

use App\Models\Courier;
use Illuminate\Database\Seeder;

// Welcome back to the program. This is Mr. New Vegas, and I hope I'm not comin' on too strong.

class CourierSeeder extends Seeder
{
    public function run(): void
    {
        Courier::factory(5)->create();
    }
}