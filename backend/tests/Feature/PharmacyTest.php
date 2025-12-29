<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Pharmacy;
use App\Models\User;

class PharmacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_pharmacies()
    {
        Pharmacy::create([
             'name' => 'Public Pharma',
             'verification_status' => 'verified',
             'verified' => true,
             'latitude' => 0, 'longitude' => 0
        ]);

        $response = $this->getJson('/api/v1/pharmacies');
        $response->assertStatus(200);
    }
    
    public function test_pharmacist_can_register_pharmacy()
    {
        $user = User::create(['name'=>'Pharma','email'=>'p@p.com','password'=>'123','role'=>'pharmacist']);
        $token = \PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth::fromUser($user);
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/pharmacy/register', [
                             'name' => 'My Pharmacy',
                             'address' => '123 St',
                             'license_number' => '123',
                             'latitude' => 10,
                             'longitude' => 10
                         ]);
                         
        $response->assertStatus(201);
    }
}
