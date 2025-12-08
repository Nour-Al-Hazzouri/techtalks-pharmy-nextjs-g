<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PharmacySeeder extends Seeder
{
    /**
     * Seed sample pharmacies with their owners.
     */
    public function run(): void
    {
        $pharmacies = [
            [
                'user' => [
                    'name' => 'John Smith',
                    'email' => 'pharmacy1@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567001',
                ],
                'pharmacy' => [
                    'name' => 'HealthCare Pharmacy',
                    'address' => '123 Main Street, Downtown, City Center',
                    'phone' => '+1234567101',
                    'license_number' => 'PHR-2024-001',
                    'verification_status' => 'verified',
                    'verified' => true,
                    'rating' => 4.5,
                    'account_status' => 'active',
                    'latitude' => 40.7128,
                    'longitude' => -74.0060,
                ],
            ],
            [
                'user' => [
                    'name' => 'Sarah Johnson',
                    'email' => 'pharmacy2@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567002',
                ],
                'pharmacy' => [
                    'name' => 'MediCare Plus',
                    'address' => '456 Oak Avenue, Medical District',
                    'phone' => '+1234567102',
                    'license_number' => 'PHR-2024-002',
                    'verification_status' => 'verified',
                    'verified' => true,
                    'rating' => 4.8,
                    'account_status' => 'active',
                    'latitude' => 40.7580,
                    'longitude' => -73.9855,
                ],
            ],
            [
                'user' => [
                    'name' => 'Michael Chen',
                    'email' => 'pharmacy3@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567003',
                ],
                'pharmacy' => [
                    'name' => 'Community Drugstore',
                    'address' => '789 Elm Street, Residential Area',
                    'phone' => '+1234567103',
                    'license_number' => 'PHR-2024-003',
                    'verification_status' => 'verified',
                    'verified' => true,
                    'rating' => 4.2,
                    'account_status' => 'active',
                    'latitude' => 40.7282,
                    'longitude' => -73.7949,
                ],
            ],
            [
                'user' => [
                    'name' => 'Emily Davis',
                    'email' => 'pharmacy4@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567004',
                ],
                'pharmacy' => [
                    'name' => 'QuickMeds Pharmacy',
                    'address' => '321 Pine Road, Shopping Mall',
                    'phone' => '+1234567104',
                    'license_number' => 'PHR-2024-004',
                    'verification_status' => 'verified',
                    'verified' => true,
                    'rating' => 4.6,
                    'account_status' => 'active',
                    'latitude' => 40.6892,
                    'longitude' => -74.0445,
                ],
            ],
            [
                'user' => [
                    'name' => 'Robert Wilson',
                    'email' => 'pharmacy5@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567005',
                ],
                'pharmacy' => [
                    'name' => 'Family Health Pharmacy',
                    'address' => '555 Maple Drive, Suburb District',
                    'phone' => '+1234567105',
                    'license_number' => 'PHR-2024-005',
                    'verification_status' => 'verified',
                    'verified' => true,
                    'rating' => 4.4,
                    'account_status' => 'active',
                    'latitude' => 40.7484,
                    'longitude' => -73.9857,
                ],
            ],
            // Pending verification pharmacies
            [
                'user' => [
                    'name' => 'Lisa Anderson',
                    'email' => 'pharmacy6@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567006',
                ],
                'pharmacy' => [
                    'name' => 'New Hope Pharmacy',
                    'address' => '999 Cedar Lane, Business Park',
                    'phone' => '+1234567106',
                    'license_number' => 'PHR-2024-006',
                    'verification_status' => 'pending',
                    'verified' => false,
                    'rating' => null,
                    'account_status' => 'active',
                    'latitude' => 40.7614,
                    'longitude' => -73.9776,
                ],
            ],
            [
                'user' => [
                    'name' => 'David Martinez',
                    'email' => 'pharmacy7@pharmy.com',
                    'password' => Hash::make('password'),
                    'role' => 'pharmacist',
                    'phone' => '+1234567007',
                ],
                'pharmacy' => [
                    'name' => 'Express Meds',
                    'address' => '777 Birch Boulevard, Transit Hub',
                    'phone' => '+1234567107',
                    'license_number' => 'PHR-2024-007',
                    'verification_status' => 'pending',
                    'verified' => false,
                    'rating' => null,
                    'account_status' => 'active',
                    'latitude' => 40.7527,
                    'longitude' => -73.9772,
                ],
            ],
        ];

        $now = now();

        foreach ($pharmacies as $data) {
            // Create pharmacist user
            $user = User::firstOrCreate(
                ['email' => $data['user']['email']],
                $data['user']
            );

            // Create pharmacy linked to user
            DB::table('pharmacies')->insert([
                'pharmacist_id' => $user->id,
                'name' => $data['pharmacy']['name'],
                'address' => $data['pharmacy']['address'],
                'latitude' => $data['pharmacy']['latitude'],
                'longitude' => $data['pharmacy']['longitude'],
                'phone' => $data['pharmacy']['phone'],
                'license_number' => $data['pharmacy']['license_number'],
                'verification_status' => $data['pharmacy']['verification_status'],
                'verified' => $data['pharmacy']['verified'],
                'rating' => $data['pharmacy']['rating'],
                'account_status' => $data['pharmacy']['account_status'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Create sample patient users
        $patients = [
            ['name' => 'Alice Patient', 'email' => 'patient1@pharmy.com', 'password' => Hash::make('password'), 'role' => 'user', 'phone' => '+1234560001'],
            ['name' => 'Bob Customer', 'email' => 'patient2@pharmy.com', 'password' => Hash::make('password'), 'role' => 'user', 'phone' => '+1234560002'],
            ['name' => 'Carol User', 'email' => 'patient3@pharmy.com', 'password' => Hash::make('password'), 'role' => 'user', 'phone' => '+1234560003'],
        ];

        foreach ($patients as $patient) {
            User::firstOrCreate(
                ['email' => $patient['email']],
                $patient
            );
        }
    }
}
