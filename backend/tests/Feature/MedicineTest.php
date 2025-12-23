<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Medicine;
use App\Models\Pharmacy;

class MedicineTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_search_medicines()
    {
        Medicine::create(['name' => 'Paracetamol', 'category' => 'Analgesic']);

        $response = $this->getJson('/api/v1/medicines/search?name=Para');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Paracetamol']);
    }
    
    public function test_can_find_nearest_medicines() 
    {
         // Setup
        $med = Medicine::create(['name' => 'Paracetamol']);
        $pharmacy = Pharmacy::create([
             'name' => 'Near Pharma',
             'address' => 'Test',
             'latitude' => 10.0000,
             'longitude' => 10.0000,
             'verification_status' => 'verified',
             'verified' => true
        ]);
        
        $pharmacy->medicines()->attach($med->id, ['price' => 10, 'quantity' => 5]);
        
        $response = $this->getJson('/api/v1/medicines/nearest?name=Paracetamol&lat=10.01&lng=10.01');
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Near Pharma']);
    }
}
