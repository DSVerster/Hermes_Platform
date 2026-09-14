<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminAccessSeeder extends Seeder
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
                'name' => 'Admin',
                'surname' => 'Admin',
                'role' => 'Admin',
                'email_account' => 'admin@gmail.com',
                'password_hash' => Hash::make('admin1234'),
            ]
        );

    }
}
