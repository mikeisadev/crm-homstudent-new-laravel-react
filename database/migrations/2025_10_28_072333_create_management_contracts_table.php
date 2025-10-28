<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Management Contracts (Contratti di gestione) for properties
     * These are contracts between property owners and the management company
     */
    public function up(): void
    {
        Schema::create('management_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->string('contract_number')->unique();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('monthly_fee', 10, 2)->nullable();
            $table->decimal('commission_percentage', 5, 2)->nullable();
            $table->enum('status', ['active', 'expired', 'terminated'])->default('active');
            $table->text('services_included')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('property_id');
            $table->index('status');
            $table->index('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('management_contracts');
    }
};
