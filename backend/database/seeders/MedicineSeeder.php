<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicine;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            ['name' => 'Paracetamol', 'generic_name' => 'Acetaminophen', 'category' => 'Analgesic'],
            ['name' => 'Ibuprofen', 'generic_name' => 'Ibuprofen', 'category' => 'Anti-inflammatory'],
            ['name' => 'Amoxicillin', 'generic_name' => 'Amoxicillin', 'category' => 'Antibiotics'],
            ['name' => 'Cetirizine', 'generic_name' => 'Cetirizine', 'category' => 'Antihistamine'],
            ['name' => 'Aspirin', 'generic_name' => 'Acetylsalicylic acid', 'category' => 'Analgesic'],
            ['name' => 'Metformin', 'generic_name' => 'Metformin', 'category' => 'Antidiabetic'],
            ['name' => 'Atorvastatin', 'generic_name' => 'Atorvastatin', 'category' => 'Statin'],
            ['name' => 'Omeprazole', 'generic_name' => 'Omeprazole', 'category' => 'Proton Pump Inhibitor'],
            ['name' => 'Simvastatin', 'generic_name' => 'Simvastatin', 'category' => 'Statin'],
            ['name' => 'Losartan', 'generic_name' => 'Losartan', 'category' => 'Antihypertensive'],
            ['name' => 'Amlodipine', 'generic_name' => 'Amlodipine', 'category' => 'Calcium Channel Blocker'],
            ['name' => 'Albuterol', 'generic_name' => 'Salbutamol', 'category' => 'Bronchodilator'],
            ['name' => 'Gabapentin', 'generic_name' => 'Gabapentin', 'category' => 'Anticonvulsant'],
            ['name' => 'Hydrochlorothiazide', 'generic_name' => 'Hydrochlorothiazide', 'category' => 'Diuretic'],
            ['name' => 'Sertraline', 'generic_name' => 'Sertraline', 'category' => 'Antidepressant'],
            ['name' => 'Montelukast', 'generic_name' => 'Montelukast', 'category' => 'Leukotriene Receptor Antagonist'],
            ['name' => 'Prednisone', 'generic_name' => 'Prednisone', 'category' => 'Corticosteroid'],
            ['name' => 'Pantoprazole', 'generic_name' => 'Pantoprazole', 'category' => 'Proton Pump Inhibitor'],
            ['name' => 'Furosemide', 'generic_name' => 'Furosemide', 'category' => 'Diuretic'],
            ['name' => 'Fluticasone', 'generic_name' => 'Fluticasone', 'category' => 'Corticosteroid'],
        ];

        foreach ($medicines as $med) {
            Medicine::create($med);
        }
        
        // Generate more dummy data to hit 100+ as requested (simulated)
         for ($i = 0; $i < 80; $i++) {
            Medicine::create([
                'name' => 'Medicine ' . ($i + 1),
                'generic_name' => 'Generic ' . ($i + 1),
                'category' => 'General',
                'description' => 'Description for medicine ' . ($i + 1)
            ]);
        }
    }
}
