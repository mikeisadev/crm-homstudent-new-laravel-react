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
        Schema::table('invoices', function (Blueprint $table) {
            // JSON field for months competence data (month, year, amount structure for all 12 months)
            $table->json('months_competence_data')->nullable()->after('months_covered');

            // Send charge flag (Si/No) - "Invio addebito"
            $table->boolean('send_charge')->default(false)->after('description');

            // Contract included amount - "Importo incluso contratto"
            $table->decimal('contract_included_amount', 10, 2)->default(0)->after('amount');

            // Amount to charge - "Importo da addebitare"
            $table->decimal('amount_to_charge', 10, 2)->default(0)->after('contract_included_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn([
                'months_competence_data',
                'send_charge',
                'contract_included_amount',
                'amount_to_charge'
            ]);
        });
    }
};
