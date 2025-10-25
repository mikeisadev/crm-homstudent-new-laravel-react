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
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('proposal_number')->unique();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');

            // Property reference (polymorphic - can be property or room)
            $table->enum('property_type', ['property', 'room']);
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('room_id')->nullable()->constrained()->onDelete('set null');

            $table->string('proposal_type')->nullable(); // sublocazione, locazione, etc
            $table->string('status')->default('draft'); // draft, sent, accepted, rejected

            // Dates
            $table->date('proposed_start_date')->nullable();
            $table->date('proposed_end_date')->nullable();

            // Financial
            $table->decimal('monthly_rent', 8, 2)->nullable();
            $table->decimal('deposit_amount', 8, 2)->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('proposal_number');
            $table->index('client_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
