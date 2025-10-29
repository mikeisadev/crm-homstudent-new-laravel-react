<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add comprehensive fields for proposal management including:
     * - Secondary client support
     * - Installments JSON structure (12 monthly payments)
     * - Additional financial and timing fields
     * - HTML document template support
     */
    public function up(): void
    {
        Schema::table('proposals', function (Blueprint $table) {
            // Secondary client (Cliente 2 / Inquilino 2)
            $table->foreignId('secondary_client_id')->nullable()->after('client_id')->constrained('clients')->onDelete('set null');

            // Notice and deposit return
            $table->integer('notice_months')->default(0)->after('proposed_end_date');
            $table->integer('deposit_return_days')->default(0)->after('notice_months');

            // Sent timestamp (Data invio - auto-filled by backend)
            $table->timestamp('sent_at')->nullable()->after('status');

            // Additional financial fields
            $table->decimal('entry_fee', 8, 2)->default(0)->after('deposit_amount');

            // Validity period
            $table->integer('validity_days')->default(2)->after('entry_fee');

            // Installments (Rateizzazione) - JSON structure
            // Each installment has: { date, amount, is_payment_completed }
            $table->json('installments_json')->nullable()->after('validity_days');

            // HTML document template for proposal generation
            $table->longText('html_document')->nullable()->after('installments_json');

            // Indexes for performance
            $table->index('secondary_client_id');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proposals', function (Blueprint $table) {
            // Drop indexes first
            $table->dropIndex(['secondary_client_id']);
            $table->dropIndex(['sent_at']);

            // Drop foreign key constraint
            $table->dropForeign(['secondary_client_id']);

            // Drop columns
            $table->dropColumn([
                'secondary_client_id',
                'notice_months',
                'deposit_return_days',
                'sent_at',
                'entry_fee',
                'validity_days',
                'installments_json',
                'html_document',
            ]);
        });
    }
};
