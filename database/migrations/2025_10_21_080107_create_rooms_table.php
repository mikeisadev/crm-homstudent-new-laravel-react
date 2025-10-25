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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('internal_code', 10);
            $table->string('room_type')->nullable(); // single, double, triple
            $table->decimal('surface_area', 6, 2)->nullable();

            // Pricing
            $table->decimal('monthly_price', 8, 2)->default(0);
            $table->decimal('weekly_price', 8, 2)->default(0);
            $table->decimal('daily_price', 8, 2)->default(0);

            // Stay requirements
            $table->enum('minimum_stay_type', ['days', 'weeks', 'months', 'years'])->default('months');
            $table->integer('minimum_stay_number')->default(0);
            $table->decimal('deposit_amount', 8, 2)->default(0);
            $table->decimal('entry_fee', 8, 2)->default(0);

            // Occupant preferences
            $table->integer('min_age')->default(0);
            $table->integer('max_age')->default(0);
            $table->boolean('smoking_allowed')->default(false);
            $table->boolean('pets_allowed')->default(false);
            $table->boolean('musical_instruments_allowed')->default(false);
            $table->enum('gender_preference', ['male', 'female', 'couple', 'family', 'any'])->nullable();
            $table->string('occupant_type')->nullable(); // student, worker, etc
            $table->boolean('has_double_bed')->default(false);

            // Contract terms
            $table->integer('cancellation_notice_months')->default(0);
            $table->string('fiscal_regime')->nullable();
            $table->decimal('fiscal_rate', 5, 2)->nullable();

            // Availability
            $table->boolean('is_published_web')->default(false);
            $table->string('availability_type'); // available, occupied, forced_free, auto_from_contracts
            $table->date('available_from')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('property_id');
            $table->index('internal_code');
            $table->index('availability_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
