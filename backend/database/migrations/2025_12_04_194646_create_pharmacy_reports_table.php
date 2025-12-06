<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pharmacy_reports', function (Blueprint $table) {
            $table->id();
              $table->unsignedBigInteger('pharmacy_id');
            $table->unsignedBigInteger('user_id')->nullable();

            $table->text('reason')->nullable();

            $table->enum('report_type', [
                'wrong_availability',
                'wrong_location',
                'wrong_contact',
                'other'
            ]);

            $table->enum('report_status', [
                'pending',
                'resolved',
                'dismissed'
            ])->default('pending');

            $table->text('resolution_notes')->nullable();

            $table->timestamps();

            $table->foreign('pharmacy_id')->references('id')->on('pharmacies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_reports');
    }
};
