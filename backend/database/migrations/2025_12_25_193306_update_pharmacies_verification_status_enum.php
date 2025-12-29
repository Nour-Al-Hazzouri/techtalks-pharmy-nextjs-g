<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE pharmacies DROP CONSTRAINT IF EXISTS pharmacies_verification_status_check");
        DB::statement("ALTER TABLE pharmacies ADD CONSTRAINT pharmacies_verification_status_check CHECK (verification_status IN ('incomplete', 'pending', 'verified', 'rejected'))");
        DB::statement("ALTER TABLE pharmacies ALTER COLUMN verification_status SET DEFAULT 'incomplete'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE pharmacies ALTER COLUMN verification_status SET DEFAULT 'pending'");
        DB::statement("ALTER TABLE pharmacies DROP CONSTRAINT IF EXISTS pharmacies_verification_status_check");
        DB::statement("ALTER TABLE pharmacies ADD CONSTRAINT pharmacies_verification_status_check CHECK (verification_status IN ('pending', 'verified', 'rejected'))");
    }
};
