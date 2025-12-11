<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pharmacy;
use App\Models\User;

class PharmacySeeder extends Seeder
{
    public function run(): void
    {
        $pharmacist = User::where('role', 'pharmacist')->first();

        if ($pharmacist) {
            Pharmacy::create([
                'pharmacist_id' => $pharmacist->id,
                'name' => 'Best Care Pharmacy',
                'address' => '123 Health St, City',
                'phone' => '555-0123',
                'verified' => true,
                'license_number' => 'RX123456',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'verification_status' => 'verified',
                'rating' => 4.5,
                'account_status' => 'active'
            ]);
            
            // Pending one
             Pharmacy::create([
                'pharmacist_id' => null, // Just for listing
                'name' => 'New Life Pharmacy',
                 'address' => '456 Wellness Blvd',
                'phone' => '555-0987',
                'verified' => false,
                'license_number' => 'RX987654',
                'latitude' => 40.7300,
                'longitude' => -73.9900,
                'verification_status' => 'pending',
            ]);
        }
    }
}
