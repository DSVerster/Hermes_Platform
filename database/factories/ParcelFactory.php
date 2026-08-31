<?php

namespace Database\Factories;

use App\Models\Parcel;
use App\Models\Staff;
use App\Models\Courier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Parcel>
 */
class ParcelFactory extends Factory
{
    public function definition(): array
{
    $received = fake()->dateTimeBetween('-2 months', 'now');
    $status = fake()->randomElement(['received', 'ready_for_collection', 'collected']);

    return [
        'courier_id' => Courier::inRandomOrder()->first()?->courier_id ?? Courier::factory(),
        'staff_id' => Staff::inRandomOrder()->first()?->staff_id ?? Staff::factory(),
        'recipient_name' => fake()->name(),
        'recipient_phone' => fake()->phoneNumber(),
        'tracking_label' => strtoupper(fake()->unique()->bothify('HP-########')),
        'parcel_type' => fake()->randomElement(['box', 'envelope', 'bag', 'tube']),
        'courier_service' => fake()->randomElement(['DHL', 'CourierGuy', 'Aramex', 'PostNet']),
        'date_received' => $received,
        'date_collected' => $status === 'collected'
            ? fake()->dateTimeBetween($received, 'now')
            : null,
        'storage_location' => 'Shelf ' . fake()->randomLetter() . fake()->numberBetween(1, 20),
        'status' => $status,
        'collection_fee' => fake()->randomFloat(2, 25, 75),
    ];
}
  
}
