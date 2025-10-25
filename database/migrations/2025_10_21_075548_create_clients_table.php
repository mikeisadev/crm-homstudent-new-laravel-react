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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            // Core identification fields
            $table->enum('type', ['private', 'business'])->default('private');
            $table->string('company_name')->nullable(); // For business clients
            $table->string('first_name');
            $table->string('last_name');

            // Primary contact info (most queried)
            $table->string('email')->nullable()->index();
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();

            // Legal/Tax info
            $table->string('tax_code', 20)->nullable()->unique(); // Codice fiscale
            $table->string('vat_number', 20)->nullable()->index(); // Partita IVA

            // Primary address (for quick access)
            $table->text('address')->nullable();
            $table->string('city')->nullable()->index();
            $table->string('province', 10)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('country')->default('Italia');

            // Origin tracking
            $table->string('origin_source')->nullable(); // How they found us
            $table->text('origin_details')->nullable();

            // General notes
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes for common queries
            $table->index(['last_name', 'first_name']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
