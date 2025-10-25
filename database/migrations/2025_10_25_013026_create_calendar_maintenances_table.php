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
        Schema::create('calendar_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained('properties')->onDelete('set null');
            $table->foreignId('room_id')->nullable()->constrained('rooms')->onDelete('set null');
            $table->string('maintenance_name'); // mold, infiltration, etc.
            $table->enum('urgency_type', ['urgent', 'medium', 'not_urgent']);
            $table->enum('maintenance_type', ['ordinary', 'extraordinary']);
            $table->date('report_date')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->onDelete('set null');
            $table->string('report_source')->nullable(); // administrator, owner, top_rent, tenants
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->string('responsible')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('start_date');
            $table->index('end_date');
            $table->index(['property_id', 'room_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_maintenances');
    }
};
