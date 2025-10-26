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
        Schema::table('clients', function (Blueprint $table) {
            // Add UUID column for private document folder
            // This UUID is used to create a unique, non-guessable folder path
            // Format: storage/app/client_documents/{uuid}/
            $table->uuid('documents_folder_uuid')->nullable()->after('id');
        });

        // Generate UUIDs for existing clients
        \DB::statement('UPDATE clients SET documents_folder_uuid = UUID() WHERE documents_folder_uuid IS NULL');

        // Now make it unique and required
        Schema::table('clients', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable(false)->change();
            $table->unique('documents_folder_uuid');
            $table->index('documents_folder_uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropIndex(['documents_folder_uuid']);
            $table->dropColumn('documents_folder_uuid');
        });
    }
};
