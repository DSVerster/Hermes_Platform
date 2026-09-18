<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultAccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user (idempotent)
        $adminEmail = 'admin@gmail.com';
        $admin = Staff::firstOrCreate(
            ['email_account' => $adminEmail],
            [
                'name' => 'admin',
                'surname' => 'admin',
                'role' => 'admin',
                'email_account' => 'admin@gmail.com',
                'password_hash' => Hash::make('admin1234'),
            ]
        );

        $front_deskEmail = 'front_desk@gmail.com';
        $front_desk = Staff::firstOrCreate(
            ['email_account' => $front_deskEmail],
            [
                'name' => 'front_desk',
                'surname' => 'front_desk',
                'role' => 'front_desk',
                'email_account' => 'front_desk@gmail.com',
                'password_hash' => Hash::make('front_desk1234'),
            ]
        );

    }
}
