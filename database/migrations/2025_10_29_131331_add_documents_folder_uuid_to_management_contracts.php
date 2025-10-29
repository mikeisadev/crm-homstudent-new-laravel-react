<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add documents_folder_uuid for secure document storage
     */
    public function up(): void
    {
        Schema::table('management_contracts', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable()->after('id');
            $table->index('documents_folder_uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('management_contracts', function (Blueprint $table) {
            $table->dropColumn('documents_folder_uuid');
        });
    }
};
