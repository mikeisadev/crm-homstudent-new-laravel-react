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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->unique();
            $table->integer('year');
            $table->integer('sequential_number');

            // Related entities
            $table->foreignId('proposal_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('secondary_client_id')->nullable()->constrained('clients')->onDelete('set null'); // For couples

            // Property reference (can be condominium, property, or room)
            $table->enum('property_type', ['condominium', 'property', 'room']);
            $table->foreignId('condominium_id')->nullable()->constrained('condominiums')->onDelete('set null');
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('room_id')->nullable()->constrained()->onDelete('set null');

            $table->string('contract_type')->nullable(); // sublocazione, locazione
            $table->string('status')->default('draft'); // draft, active, ended, cancelled

            // Contract period
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('cancellation_notice_months')->default(0);

            // Financial
            $table->decimal('monthly_rent', 8, 2);
            $table->decimal('deposit_amount', 8, 2)->default(0);
            $table->decimal('entry_fee', 8, 2)->default(0);
            $table->integer('deposit_refund_percentage')->default(100);

            // Document storage
            $table->longText('html_content')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('origin')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('contract_number');
            $table->index(['year', 'sequential_number']);
            $table->index('client_id');
            $table->index('status');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
