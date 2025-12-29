<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PharmacyMedicineSeeder extends Seeder
{
    /**
     * Seed pharmacy inventory with random medicines and quantities.
     */
    public function run(): void
    {
        // Get all verified pharmacies
        $pharmacies = DB::table('pharmacies')
            ->where('verification_status', 'verified')
            ->get();

        // Get all medicines
        $medicines = DB::table('medicines')->get();

        if ($pharmacies->isEmpty() || $medicines->isEmpty()) {
            $this->command->warn('No pharmacies or medicines found. Run PharmacySeeder and MedicineSeeder first.');
            return;
        }

        $inventoryData = [];

        foreach ($pharmacies as $pharmacy) {
            // Each pharmacy gets 30-60 random medicines
            $medicineCount = rand(30, 60);
            $selectedMedicines = $medicines->random(min($medicineCount, $medicines->count()));

            foreach ($selectedMedicines as $medicine) {
                $inventoryData[] = [
                    'pharmacy_id' => $pharmacy->id,
                    'medicine_id' => $medicine->id,
                    'quantity' => rand(0, 200),
                    'price' => round(rand(100, 5000) / 100, 2), // Price between 1.00 and 50.00
                    'available' => rand(0, 10) > 1, // 90% chance of being available
                ];
            }
        }

        // Insert in chunks to avoid memory issues
        $chunks = array_chunk($inventoryData, 100);
        foreach ($chunks as $chunk) {
            DB::table('pharmacy_medicines')->insert($chunk);
        }

        $this->command->info('Seeded ' . count($inventoryData) . ' inventory records.');
    }
}
