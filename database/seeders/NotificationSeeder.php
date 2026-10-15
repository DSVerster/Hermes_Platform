<?php

namespace Database\Seeders;

use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    // There's a difference between a road and a destination. You're looking at the dust, not where it leads.
    public function run(): void
    {
        Notification::factory(60)->create();
    }
}