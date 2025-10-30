<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Rename Italian column names to English
     * CRITICAL: Code must be in English, only UI labels in Italian
     *
     * - referente -> contact_person
     * - email_invio -> sending_email
     */
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            // Rename Italian column names to English
            $table->renameColumn('referente', 'contact_person');
            $table->renameColumn('email_invio', 'sending_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            // Revert to Italian names
            $table->renameColumn('contact_person', 'referente');
            $table->renameColumn('sending_email', 'email_invio');
        });
    }
};
