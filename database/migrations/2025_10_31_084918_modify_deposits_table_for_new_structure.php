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
        Schema::table('deposits', function (Blueprint $table) {
            // Add polymorphic relationship fields if they don't exist
            if (!Schema::hasColumn('deposits', 'depositable_type')) {
                $table->string('depositable_type')->nullable()->after('id');
            }
            if (!Schema::hasColumn('deposits', 'depositable_id')) {
                $table->unsignedBigInteger('depositable_id')->nullable()->after('depositable_type');
            }

            // Add payment_document_file if it doesn't exist
            if (!Schema::hasColumn('deposits', 'payment_document_file')) {
                $table->string('payment_document_file')->nullable();
            }

            // Add soft deletes if not exists
            if (!Schema::hasColumn('deposits', 'deleted_at')) {
                $table->softDeletes();
            }

            // Add index for polymorphic relationship
            $table->index(['depositable_type', 'depositable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deposits', function (Blueprint $table) {
            $table->dropIndex(['depositable_type', 'depositable_id']);

            if (Schema::hasColumn('deposits', 'depositable_type')) {
                $table->dropColumn('depositable_type');
            }
            if (Schema::hasColumn('deposits', 'depositable_id')) {
                $table->dropColumn('depositable_id');
            }
            if (Schema::hasColumn('deposits', 'payment_document_file')) {
                $table->dropColumn('payment_document_file');
            }
            if (Schema::hasColumn('deposits', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
