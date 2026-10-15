<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            StaffSeeder::class,
            DefaultAccessSeeder::class,
            CourierSeeder::class, // You are a courier, hired by the Mojave Express to deliver a package to the New Vegas Strip. What seemed like a simple delivery job has taken a turn... for the worse.
            ParcelSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}