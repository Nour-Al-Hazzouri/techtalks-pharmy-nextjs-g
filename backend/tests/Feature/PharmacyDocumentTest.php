<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;
use App\Models\Pharmacy;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class PharmacyDocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_pharmacist_can_upload_document()
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Pharmacist Doc',
            'email' => 'doc@test.com',
            'password' => bcrypt('password'),
            'role' => 'pharmacist'
        ]);

        $pharmacy = Pharmacy::create([
            'pharmacist_id' => $user->id,
            'name' => 'Doc Pharmacy',
            'address' => 'Address',
            'license_number' => 'LIC-DOC',
            'latitude' => 10, 'longitude' => 20
        ]);

        $token = JWTAuth::fromUser($user);

        $file = UploadedFile::fake()->create('license.pdf', 100);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/pharmacy/documents', [
                             'file' => $file,
                             'doc_type' => 'license'
                         ]);

        $response->assertStatus(201);
        
        // Assert file exists
        // Note: The service stores key as 'documents/{id}/{hash}.pdf'
        // We need to check database to know exact path, or just assert database has record
        $this->assertDatabaseHas('pharmacy_documents', [
            'pharmacy_id' => $pharmacy->id,
            'doc_type' => 'license'
        ]);
    }

    public function test_admin_can_view_pharmacy_documents()
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Pharmacist Doc 2',
            'email' => 'doc2@test.com',
            'password' => bcrypt('password'),
            'role' => 'pharmacist'
        ]);

        $pharmacy = Pharmacy::create([
            'pharmacist_id' => $user->id,
            'name' => 'Doc Pharmacy 2',
            'address' => 'Address 2',
            'license_number' => 'LIC-DOC-2',
            'latitude' => 10, 'longitude' => 20
        ]);

        // Upload a document
        $pharmacy->documents()->create([
            'file_path' => 'documents/test.pdf',
            'doc_type' => 'license'
        ]);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);
        $token = JWTAuth::fromUser($admin);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson("/api/v1/admin/pharmacies/{$pharmacy->id}/documents");

        $response->assertStatus(200)
                 ->assertJsonFragment(['doc_type' => 'license']);
    }

    public function test_pharmacist_can_view_own_documents()
    {
        Storage::fake('public');
        $user = User::create(['name' => 'PharmView', 'email' => 'view@test.com', 'password' => bcrypt('pw'), 'role' => 'pharmacist']);
        $pharmacy = Pharmacy::create(['pharmacist_id' => $user->id, 'name' => 'Pharm View', 'address' => 'Addr', 'license_number' => 'L', 'latitude' => 0, 'longitude' => 0]);
        $pharmacy->documents()->create(['file_path' => 'doc.pdf', 'doc_type' => 'license']);

        $token = JWTAuth::fromUser($user);
        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->getJson('/api/v1/pharmacy/documents')
             ->assertStatus(200)
             ->assertJsonCount(1, 'data');
    }

    public function test_pharmacist_can_delete_document()
    {
        Storage::fake('public');
        $user = User::create(['name' => 'PharmDel', 'email' => 'del@test.com', 'password' => bcrypt('pw'), 'role' => 'pharmacist']);
        $pharmacy = Pharmacy::create(['pharmacist_id' => $user->id, 'name' => 'Pharm Del', 'address' => 'Addr', 'license_number' => 'L', 'latitude' => 0, 'longitude' => 0]);
        
        $file = UploadedFile::fake()->create('doc.pdf');
        $path = $file->store('documents', 'public');
        $doc = $pharmacy->documents()->create(['file_path' => $path, 'doc_type' => 'license']);

        $token = JWTAuth::fromUser($user);
        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->deleteJson("/api/v1/pharmacy/documents/{$doc->id}")
             ->assertStatus(200);

        $this->assertDatabaseMissing('pharmacy_documents', ['id' => $doc->id]);
        Storage::disk('public')->assertMissing($path);
    }
    
    public function test_pharmacist_can_update_document()
    {
        Storage::fake('public');
        $user = User::create(['name' => 'PharmUpd', 'email' => 'upd@test.com', 'password' => bcrypt('pw'), 'role' => 'pharmacist']);
        $pharmacy = Pharmacy::create(['pharmacist_id' => $user->id, 'name' => 'Pharm Upd', 'address' => 'Addr', 'license_number' => 'L', 'latitude' => 0, 'longitude' => 0]);
        
        $oldFile = UploadedFile::fake()->create('old.pdf');
        $oldPath = $oldFile->store('documents', 'public');
        $doc = $pharmacy->documents()->create(['file_path' => $oldPath, 'doc_type' => 'license']);

        $newFile = UploadedFile::fake()->create('new.pdf', 200);
        
        $token = JWTAuth::fromUser($user);
        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->postJson("/api/v1/pharmacy/documents/{$doc->id}", [
                 'file' => $newFile,
                 'doc_type' => 'registration'
             ])
             ->assertStatus(200);

        $this->assertDatabaseHas('pharmacy_documents', [
            'id' => $doc->id,
            'doc_type' => 'registration'
        ]);
        
        Storage::disk('public')->assertMissing($oldPath);
        // New file path is dynamic, so we just check old is gone and DB is updated
    }

    public function test_admin_can_view_all_documents()
    {
        Storage::fake('public');
        // Create 2 pharmacies with documents
        $p1 = Pharmacy::create(['pharmacist_id' => User::create(['name'=>'P1','email'=>'p1@t.com','password'=>'p','role'=>'pharmacist'])->id, 'name'=>'P1', 'address'=>'A', 'license_number'=>'1', 'latitude'=>0, 'longitude'=>0]);
        $p1->documents()->create(['file_path'=>'d1.pdf', 'doc_type'=>'license']);

        $p2 = Pharmacy::create(['pharmacist_id' => User::create(['name'=>'P2','email'=>'p2@t.com','password'=>'p','role'=>'pharmacist'])->id, 'name'=>'P2', 'address'=>'A', 'license_number'=>'2', 'latitude'=>0, 'longitude'=>0]);
        $p2->documents()->create(['file_path'=>'d2.pdf', 'doc_type'=>'id_proof']);

        $admin = User::create(['name'=>'Admin','email'=>'adm@t.com','password'=>bcrypt('p'),'role'=>'admin']);
        $token = JWTAuth::fromUser($admin);

        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->getJson('/api/v1/admin/documents')
             ->assertStatus(200)
             ->assertJsonCount(2, 'data')
             ->assertJsonStructure(['data' => [['id', 'doc_type', 'pharmacy' => ['id', 'name']]]]);
    }

    public function test_pharmacist_can_view_single_document()
    {
        Storage::fake('public');
        $user = User::create(['name'=>'PView1','email'=>'pv1@t.com','password'=>bcrypt('p'),'role'=>'pharmacist']);
        $pharmacy = Pharmacy::create(['pharmacist_id'=>$user->id, 'name'=>'PView1', 'address'=>'A', 'license_number'=>'1', 'latitude'=>0, 'longitude'=>0]);
        $doc = $pharmacy->documents()->create(['file_path'=>'d1.pdf', 'doc_type'=>'license']);

        $token = JWTAuth::fromUser($user);
        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->getJson("/api/v1/pharmacy/documents/{$doc->id}")
             ->assertStatus(200)
             ->assertJsonFragment(['id' => $doc->id, 'doc_type' => 'license']);
    }
}
