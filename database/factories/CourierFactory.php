<?php

namespace Database\Factories;

use App\Models\Courier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Courier>
 */
class CourierFactory extends Factory
{
    public function definition(): array
{
    return [
        'name' => fake()->company(),
        'description' => fake()->sentence(),
        'contact_person' => fake()->name(),
        'contact_number' => fake()->phoneNumber(),
        'email' => fake()->unique()->companyEmail(),
        'website' => fake()->url(),
    ];
}
}
