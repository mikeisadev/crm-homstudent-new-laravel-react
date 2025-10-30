<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add additional fields required for Italian supplier management:
     * - SDI (Sistema di Interscambio) code
     * - Referente (contact person)
     * - FAX number
     * - Email invio (sending email)
     * - PEC (Posta Elettronica Certificata)
     */
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            // SDI code (Sistema di Interscambio - Italian electronic invoicing)
            $table->string('sdi', 7)->nullable()->after('vat_number');

            // Contact person/referent
            $table->string('referente')->nullable()->after('name');

            // FAX number
            $table->string('fax', 20)->nullable()->after('mobile');

            // Sending email (separate from main email)
            $table->string('email_invio')->nullable()->after('email');

            // PEC (Certified email for Italian legal correspondence)
            $table->string('pec')->nullable()->after('email_invio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn([
                'sdi',
                'referente',
                'fax',
                'email_invio',
                'pec',
            ]);
        });
    }
};
