<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pharmacy;
use App\Models\Medicine;

class PharmacyMedicineSeeder extends Seeder
{
    public function run(): void
    {
        $pharmacy = Pharmacy::first();
        $medicines = Medicine::take(20)->get();

        if ($pharmacy) {
            foreach ($medicines as $med) {
                $pharmacy->medicines()->attach($med->id, [
                    'quantity' => rand(10, 100),
                    'price' => rand(5, 50) + 0.99,
                    'available' => true
                ]);
            }
        }
    }
}
