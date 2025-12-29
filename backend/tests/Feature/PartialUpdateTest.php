<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Pharmacy;
use App\Models\Medicine;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class PartialUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_pharmacist_can_partially_update_pharmacy_profile()
    {
        $user = User::create([
            'name' => 'Pharmacist',
            'email' => 'pharmacist@test.com',
            'password' => bcrypt('password'),
            'role' => 'pharmacist'
        ]);

        $pharmacy = Pharmacy::create([
            'pharmacist_id' => $user->id,
            'name' => 'Original Name',
            'address' => 'Original Address',
            'license_number' => 'LIC-123',
            'latitude' => 10,
            'longitude' => 20,
            'verification_status' => 'verified',
            'verified' => true
        ]);

        $token = JWTAuth::fromUser($user);

        // Update Name Only (PATCH)
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->patchJson('/api/v1/pharmacy/profile', [
                             'name' => 'New Name'
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('pharmacies', [
            'id' => $pharmacy->id,
            'name' => 'New Name',
            'address' => 'Original Address' // Verified unchanged
        ]);
        
        // Update Address Only (PUT)
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->putJson('/api/v1/pharmacy/profile', [
                             'address' => 'New Address'
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('pharmacies', [
            'id' => $pharmacy->id,
            'address' => 'New Address'
        ]);
    }

    public function test_pharmacist_can_partially_update_inventory()
    {
        $user = User::create([
            'name' => 'Pharmacist Inv',
            'email' => 'inv@test.com',
            'password' => bcrypt('password'),
            'role' => 'pharmacist'
        ]);
        
        $token = JWTAuth::fromUser($user);

        $pharmacy = Pharmacy::create([
            'pharmacist_id' => $user->id,
            'name' => 'Inv Pharmacy',
            'address' => 'Address',
            'license_number' => 'LIC-INV',
            'latitude' => 10, 'longitude' => 20
        ]);

        $medicine = Medicine::create(['name' => 'Pill', 'description' => 'Desc']);

        // Add to inventory
        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->postJson('/api/v1/pharmacy/inventory', [
                 'medicine_id' => $medicine->id,
                 'quantity' => 10,
                 'price' => 50
             ])->assertStatus(200);

        // Fetch inventory item to get ID
        $list = $this->withHeaders(['Authorization' => "Bearer $token"])
                     ->getJson('/api/v1/pharmacy/inventory');
        $itemId = $list->json('data.0.id');

        // Update Quantity Only (PATCH)
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->patchJson("/api/v1/pharmacy/inventory/{$itemId}", [
                             'quantity' => 20
                         ]);

        $response->assertStatus(200);
        
        // Verify update in response or DB check
        // We can't easily check Pivot DB directly via asserts helpers without custom query, 
        // but fetching list verifies it.
        $list = $this->withHeaders(['Authorization' => "Bearer $token"])
                     ->getJson('/api/v1/pharmacy/inventory');
                    
        $this->assertEquals(20, $list->json('data.0.pivot.quantity')); 
        // Note: verified getInventory returns Medicine with pivot data now.
        // Check structure in resource. MedicineResource returns 'pivot' object?
        // Step 141: 'pivot' => $this->whenPivotLoaded(...)
        // Yes, 'pivot.quantity'.
    }
}
