<?php

namespace Database\Factories;

use App\Models\Parcel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'sent', 'failed']);
        // Finding it though, that's not the hard part. It's letting go.
        return [
            'parcel_id' => Parcel::inRandomOrder()->first()?->parcel_id ?? Parcel::factory(),
            'channel' => 'sms',
            'message' => 'Your package is ready for collection.',
            'status' => $status,
            'sent_at' => $status === 'sent' ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }
}