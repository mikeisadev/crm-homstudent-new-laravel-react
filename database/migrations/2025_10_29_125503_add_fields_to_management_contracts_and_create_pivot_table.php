<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add new fields to management_contracts and create pivot table for owners
     */
    public function up(): void
    {
        // Add new fields to management_contracts table
        Schema::table('management_contracts', function (Blueprint $table) {
            // Contract type: "Con rappresentanza", "Senza rappresentanza"
            $table->string('contract_type')->nullable()->after('property_id');

            // Manager: "Top rent", etc.
            $table->string('manager')->nullable()->after('contract_type');

            // Current date when contract was created
            $table->date('current_date')->nullable()->after('manager');

            // Notice months for cancellation
            $table->integer('notice_months')->default(0)->after('end_date');

            // Early termination notes
            $table->text('early_termination_notes')->nullable()->after('notes');

            // Update status enum to match kanban columns
            // Drop the old enum and create new one
            $table->dropColumn('status');
        });

        // Add the new status column with correct values
        Schema::table('management_contracts', function (Blueprint $table) {
            $table->enum('status', [
                'draft',           // Bozza di proposta
                'active',          // Contratto attivo
                'ongoing',         // Contratto in corso
                'expired',         // Contratto scaduto
                'terminated'       // Disdetto anticipatamente
            ])->default('draft')->after('commission_percentage');
        });

        // Create pivot table for management_contract_owners
        Schema::create('management_contract_owners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('management_contract_id')->constrained('management_contracts')->onDelete('cascade');
            $table->foreignId('owner_id')->constrained('owners')->onDelete('cascade');
            $table->timestamps();

            // Ensure unique combinations
            $table->unique(['management_contract_id', 'owner_id'], 'mc_owner_unique');

            // Indexes for performance
            $table->index('management_contract_id');
            $table->index('owner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop pivot table
        Schema::dropIfExists('management_contract_owners');

        // Remove new fields from management_contracts
        Schema::table('management_contracts', function (Blueprint $table) {
            $table->dropColumn([
                'contract_type',
                'manager',
                'current_date',
                'notice_months',
                'early_termination_notes',
            ]);
        });

        // Restore original status enum
        Schema::table('management_contracts', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('management_contracts', function (Blueprint $table) {
            $table->enum('status', ['active', 'expired', 'terminated'])
                ->default('active')
                ->after('commission_percentage');
        });
    }
};
