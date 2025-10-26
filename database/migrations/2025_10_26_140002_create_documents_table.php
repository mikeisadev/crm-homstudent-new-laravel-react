<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Polymorphic documents table - works with any entity (Client, Room, Property, Condominium)
     * Uses documentable_type and documentable_id for polymorphic relationships
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();

            // Polymorphic relationship - can belong to any entity
            $table->morphs('documentable'); // Creates documentable_type & documentable_id

            // Foreign key to folder (nullable for root folder)
            $table->foreignId('folder_id')->nullable()->constrained('document_folders')->onDelete('cascade');

            // Document details
            $table->string('name'); // Original filename (user-friendly)
            $table->string('stored_name'); // UUID-based filename on disk (security)
            $table->string('extension', 10); // File extension (pdf, jpg, png, doc, docx)
            $table->string('mime_type', 100); // MIME type for validation
            $table->unsignedInteger('size'); // File size in bytes
            $table->string('path'); // Relative path within entity's UUID folder

            // Computed flags for frontend
            $table->boolean('is_viewable')->default(false); // Can be viewed in browser
            $table->boolean('is_image')->default(false); // Is an image
            $table->boolean('is_pdf')->default(false); // Is a PDF

            // Metadata
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance and security (morphs() already creates documentable index)
            $table->index('folder_id');
            $table->index('extension');
            $table->index('created_at');

            // Ensure unique stored names across all entities
            $table->unique('stored_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
