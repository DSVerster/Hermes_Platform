<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $team = [
            ['name' => 'DS', 'surname' => 'Verster', 'role' => 'Admin'],
            ['name' => 'A', 'surname' => 'Ismail', 'role' => 'Front_Desk'],
            ['name' => 'S', 'surname' => 'Scwebu', 'role' => 'Manager'],
            ['name' => 'A', 'surname' => 'Aswat', 'role' => 'Front_Desk'],
            ['name' => 'J', 'surname' => 'Burger', 'role' => 'Manager'],
            ['name' => 'D', 'surname' => 'Msibi', 'role' => 'Front_Desk'],
            ['name' => 'L', 'surname' => 'Marange', 'role' => 'Front_Desk'],
            ['name' => 'C', 'surname' => 'Goeminne', 'role' => 'Manager'],
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