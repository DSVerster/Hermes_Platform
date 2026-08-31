<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\Parcel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class StaffFactory extends Factory
{
    public function definition(): array
{
    return [
        'name' => fake()->firstName(),
        'surname' => fake()->lastName(),
        'role' => fake()->randomElement(['front_desk', 'Admin','Manager','Warehouse']),
        'email_account' => fake()->unique()->safeEmail(),
        'password_hash' => bcrypt('password'),
    ];
}
    
}
