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
        Schema::create('pharmacies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pharmacist_id')->nullable();

            $table->string('name');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('verified')->default(false);
            $table->string('license_number')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('verification_status', ['incomplete', 'pending', 'verified', 'rejected'])->default('incomplete');
            $table->text('rejection_reason')->nullable();

            $table->decimal('rating', 3, 2)->nullable();
            $table->enum('account_status', ['active','suspended','flagged'])->default('active');

            $table->foreign('pharmacist_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

   
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacies');
    }
};
