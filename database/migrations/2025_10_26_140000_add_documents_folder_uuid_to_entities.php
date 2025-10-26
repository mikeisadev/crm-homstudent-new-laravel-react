<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add documents_folder_uuid to rooms, properties, and condominiums
     * Each entity gets a unique UUID for document storage isolation
     */
    public function up(): void
    {
        // ROOMS
        Schema::table('rooms', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable()->after('id');
        });

        // Generate UUIDs for existing rooms
        DB::table('rooms')->whereNull('documents_folder_uuid')->update([
            'documents_folder_uuid' => DB::raw('(UUID())')
        ]);

        // Make it unique and required
        Schema::table('rooms', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable(false)->change();
            $table->unique('documents_folder_uuid');
            $table->index('documents_folder_uuid');
        });

        // PROPERTIES
        Schema::table('properties', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable()->after('id');
        });

        // Generate UUIDs for existing properties
        DB::table('properties')->whereNull('documents_folder_uuid')->update([
            'documents_folder_uuid' => DB::raw('(UUID())')
        ]);

        // Make it unique and required
        Schema::table('properties', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable(false)->change();
            $table->unique('documents_folder_uuid');
            $table->index('documents_folder_uuid');
        });

        // CONDOMINIUMS
        Schema::table('condominiums', function (Blueprint $table) {
            $table->uuid('documents_folder_uuid')->nullable()->after('id');
        });

        // Generate UUIDs for existing condominiums
        DB::table('condominiums')->whereNull('documents_folder_uuid')->update([
            'documents_folder_uuid' => DB::raw('(UUID())')
        ]);

        // Make it unique and required
        Schema::table('condominiums', function (Blueprint $table) {
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
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropIndex(['documents_folder_uuid']);
            $table->dropColumn('documents_folder_uuid');
        });

        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['documents_folder_uuid']);
            $table->dropColumn('documents_folder_uuid');
        });

        Schema::table('condominiums', function (Blueprint $table) {
            $table->dropIndex(['documents_folder_uuid']);
            $table->dropColumn('documents_folder_uuid');
        });
    }
};
