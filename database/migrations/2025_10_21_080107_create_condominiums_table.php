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
        Schema::create('condominiums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tax_code', 20)->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('province', 10)->nullable();
            $table->string('postal_code', 10);
            $table->string('country')->default('Italia');
            $table->integer('construction_year')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Administrator info
            $table->string('administrator_name')->nullable();
            $table->string('administrator_phone', 20)->nullable();
            $table->string('administrator_mobile', 20)->nullable();
            $table->string('administrator_toll_free', 20)->nullable();
            $table->string('administrator_email')->nullable();
            $table->string('administrator_pec')->nullable();

            // Utilities info
            $table->text('water_meters_info')->nullable();
            $table->text('electricity_meters_info')->nullable();
            $table->text('gas_meters_info')->nullable();
            $table->text('heating_system_info')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('condominiums');
    }
};
