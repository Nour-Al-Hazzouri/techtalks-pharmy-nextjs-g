<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Run seeders in dependency order:
     * 1. AdminUserSeeder - Creates admin users first
     * 2. MedicineSeeder - Creates medicine catalog (no dependencies)
     * 3. PharmacySeeder - Creates pharmacies and pharmacist/patient users
     * 4. PharmacyMedicineSeeder - Links pharmacies to medicines (depends on 2 & 3)
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            MedicineSeeder::class,
            PharmacySeeder::class,
            PharmacyMedicineSeeder::class,
        ]);
    }
}
