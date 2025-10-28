<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates condominium_photos table for storing condominium images
     */
    public function up(): void
    {
        Schema::create('condominium_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->onDelete('cascade');
            $table->string('original_name');
            $table->string('stored_name')->unique();
            $table->string('mime_type', 100);
            $table->unsignedInteger('size');
            $table->string('path');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('condominium_id');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('condominium_photos');
    }
};
