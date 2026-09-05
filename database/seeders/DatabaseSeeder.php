<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $this->call([
            StaffSeeder::class,
            AdminAccessSeeder::class,
            CourierSeeder::class,
            ParcelSeeder::class,
            NotificationSeeder::class,
         ]);
    }
}
