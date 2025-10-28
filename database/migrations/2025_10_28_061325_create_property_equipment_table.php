<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates many-to-many pivot table for properties and equipment
     */
    public function up(): void
    {
        Schema::create('property_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('equipment_id')->constrained('equipment')->onDelete('cascade');
            $table->timestamps();

            // Unique constraint to prevent duplicate equipment assignments
            $table->unique(['property_id', 'equipment_id']);

            $table->index('property_id');
            $table->index('equipment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_equipment');
    }
};
