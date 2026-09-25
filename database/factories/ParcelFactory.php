<?php
namespace Database\Factories;

use App\Models\Courier;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParcelFactory extends Factory
{
    public function definition(): array
    {
        $received = fake()->dateTimeBetween('-2 months', 'now');
        $status = fake()->randomElement(['received', 'collected']);
        return [
            'courier_id' => Courier::inRandomOrder()->first()?->courier_id ?? Courier::factory(),
            'staff_id' => Staff::inRandomOrder()->first()?->staff_id ?? Staff::factory(),
            'recipient_name' => fake()->name(),
            'recipient_phone' => '+27 ' . fake()->numerify('##########'),
            'tracking_number' => strtoupper(fake()->unique()->bothify('HP-########')),
            'parcel_type' => fake()->randomElement(['box', 'envelope', 'bag', 'tube', 'flyer']),
            'courier_service' => fake()->randomElement(['DHL', 'CourierGuy', 'Aramex', 'PostNet']),
            'date_received' => $received,
            'date_collected' => $status === 'collected' ? fake()->dateTimeBetween($received, 'now') : null,
            'storage_location' => 'Shelf ' . fake()->randomLetter() . fake()->numberBetween(1, 20),
            'status' => $status,
            'collection_fee' => 50,
        ];
    }
}