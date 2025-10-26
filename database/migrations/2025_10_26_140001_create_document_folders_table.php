<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Polymorphic document folders table - works with any entity
     * Each entity has its own independent folder structure
     */
    public function up(): void
    {
        Schema::create('document_folders', function (Blueprint $table) {
            $table->id();

            // Polymorphic relationship - can belong to any entity
            $table->morphs('folderable'); // Creates folderable_type & folderable_id

            // Folder hierarchy
            $table->foreignId('parent_folder_id')->nullable()->constrained('document_folders')->onDelete('cascade');

            // Folder details
            $table->string('name'); // User-friendly folder name
            $table->text('path')->nullable(); // Full path for quick lookups

            // Metadata
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance (morphs() already creates folderable index)
            $table->index('parent_folder_id');
            $table->index('name');

            // Ensure unique folder names per parent within same entity
            // This prevents duplicate folder names in the same location
            $table->unique(['folderable_type', 'folderable_id', 'parent_folder_id', 'name'], 'unique_folder_name_per_parent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_folders');
    }
};
