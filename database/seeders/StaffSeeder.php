<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $team = [
            ['name' => 'DS', 'surname' => 'Verster', 'role' => 'Manager'],
            ['name' => 'A', 'surname' => 'Ismail', 'role' => 'front_desk'],
            ['name' => 'S', 'surname' => 'Scwebu', 'role' => 'front_desk'],
            ['name' => 'A', 'surname' => 'Aswat', 'role' => 'front_desk'],
            ['name' => 'J', 'surname' => 'Burger', 'role' => 'Warehouse'],
            ['name' => 'D', 'surname' => 'Msibi', 'role' => 'Warehouse'],
            ['name' => 'L', 'surname' => 'Marange', 'role' => 'Warehouse'],
            ['name' => 'C', 'surname' => 'Goeminne', 'role' => 'Admin'],
        ];

        foreach ($team as $member) {
            Staff::factory()->create([
                'name' => $member['name'],
                'surname' => $member['surname'],
                'role' => $member['role'],
                'email_account' => strtolower($member['name'] . '.' . $member['surname']) . '@hermesplatform.test',
            ]);
        }
    }
}