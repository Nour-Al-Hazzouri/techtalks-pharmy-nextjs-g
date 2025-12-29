<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{

    /**
     * Seed the admin users.
     */
    public function run(): void
    {
        // Create main admin user
        User::firstOrCreate(
            ['email' => 'admin@pharmy.com'],
            [
                'name' => 'Pharmy Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+1234567890',
            ]
        );

        // Create secondary admin for testing
        User::firstOrCreate(
            ['email' => 'superadmin@pharmy.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+1987654321',
            ]
        );

    }
}
