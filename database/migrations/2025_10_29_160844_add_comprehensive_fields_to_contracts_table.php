<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add comprehensive fields for contract management including:
     * - Deposit return days
     * - Installments JSON structure (12 monthly payments)
     * - Sent timestamp
     * - Validity days
     * - HTML document template support
     */
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            // Deposit return days (Giorni per la restituzione della caparra)
            $table->integer('deposit_return_days')->default(0)->after('deposit_amount');

            // Sent timestamp (Data invio - auto-filled by backend)
            $table->timestamp('sent_at')->nullable()->after('status');

            // Validity period (Giorni di validità)
            $table->integer('validity_days')->default(2)->after('entry_fee');

            // Installments (Rateizzazione) - JSON structure
            // Each installment has: { number, date, amount, is_payment_completed }
            $table->json('installments_json')->nullable()->after('validity_days');

            // HTML document template for contract generation
            // Note: html_content already exists, keeping both for compatibility
            $table->longText('html_document')->nullable()->after('installments_json');

            // Indexes for performance
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            // Drop index first
            $table->dropIndex(['sent_at']);

            // Drop columns
            $table->dropColumn([
                'deposit_return_days',
                'sent_at',
                'validity_days',
                'installments_json',
                'html_document',
            ]);
        });
    }
};
