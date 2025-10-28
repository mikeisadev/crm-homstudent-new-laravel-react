<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates property_meta table for extensible property metadata
     * Following the same pattern as client_meta
     */
    public function up(): void
    {
        Schema::create('property_meta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('meta_key')->index();
            $table->text('meta_value')->nullable();
            $table->timestamps();

            // Composite index for fast lookups
            $table->index(['property_id', 'meta_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_meta');
    }
};
