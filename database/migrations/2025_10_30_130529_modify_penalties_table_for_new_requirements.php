<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add polymorphic relationship and file fields to penalties table
     */
    public function up(): void
    {
        Schema::table('penalties', function (Blueprint $table) {
            // Add polymorphic relationship for Room or Property
            $table->string('penaltyable_type')->nullable()->after('id');
            $table->unsignedBigInteger('penaltyable_id')->nullable()->after('penaltyable_type');

            // Add file storage paths
            $table->string('invoice_file')->nullable()->after('amount');
            $table->string('payment_document_file')->nullable()->after('invoice_file');

            // Add index for polymorphic relationship
            $table->index(['penaltyable_type', 'penaltyable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penalties', function (Blueprint $table) {
            $table->dropIndex(['penaltyable_type', 'penaltyable_id']);
            $table->dropColumn(['penaltyable_type', 'penaltyable_id', 'invoice_file', 'payment_document_file']);
        });
    }
};
