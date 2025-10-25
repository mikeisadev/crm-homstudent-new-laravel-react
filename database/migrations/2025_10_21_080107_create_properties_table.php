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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->nullable()->constrained('condominiums')->onDelete('set null');
            $table->string('internal_code', 30)->nullable()->unique();
            $table->string('name');
            $table->string('property_type')->nullable(); // apartment, office, etc

            // Address
            $table->string('address');
            $table->string('portal_address')->nullable(); // For listings
            $table->string('city');
            $table->string('province', 10)->nullable();
            $table->string('postal_code', 10);
            $table->string('country')->default('Italia');
            $table->string('zone')->nullable();

            // Property details
            $table->string('intended_use')->nullable(); // residential, commercial
            $table->string('layout')->nullable(); // layout type
            $table->decimal('surface_area', 8, 2)->nullable(); // sqm
            $table->string('property_status')->nullable(); // available, rented, maintenance
            $table->integer('floor_number')->nullable();
            $table->integer('total_floors')->nullable();
            $table->integer('construction_year')->nullable();
            $table->string('condition')->nullable(); // excellent, good, fair, poor

            // Features
            $table->integer('bathrooms_with_tub')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->integer('balconies')->default(0);
            $table->boolean('has_concierge')->default(false);

            // Publishing
            $table->boolean('is_published_web')->default(false);
            $table->string('web_address')->nullable();
            $table->text('description')->nullable();

            // Cadastral data
            $table->string('cadastral_section')->nullable();
            $table->string('cadastral_sheet')->nullable();
            $table->string('cadastral_particle')->nullable();
            $table->string('cadastral_subordinate')->nullable();
            $table->string('cadastral_category')->nullable();
            $table->decimal('cadastral_income', 10, 2)->nullable();

            // Energy & utilities
            $table->string('energy_certificate')->nullable();
            $table->string('heating_type')->nullable();
            $table->string('cooling_type')->nullable();
            $table->string('hot_water_type')->nullable();
            $table->string('cold_water_meter')->nullable();
            $table->string('electricity_pod')->nullable();
            $table->string('gas_pdr')->nullable();

            // Suppliers
            $table->string('water_supplier')->nullable();
            $table->text('water_contract_details')->nullable();
            $table->string('gas_supplier')->nullable();
            $table->text('gas_contract_details')->nullable();
            $table->string('electricity_supplier')->nullable();
            $table->text('electricity_contract_details')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('city');
            $table->index('property_status');
            $table->index('is_published_web');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
