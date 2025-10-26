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
        Schema::create('client_documents', function (Blueprint $table) {
            $table->id();

            // Foreign key to client
            $table->foreignId('client_id')->constrained()->onDelete('cascade');

            // Foreign key to folder (nullable for root folder)
            $table->foreignId('folder_id')->nullable()->constrained('client_folders')->onDelete('cascade');

            // Document details
            $table->string('name'); // Original filename
            $table->string('stored_name'); // Hashed filename on disk (security)
            $table->string('extension', 10); // File extension (pdf, jpg, png, doc, docx)
            $table->string('mime_type', 100); // MIME type for validation
            $table->unsignedInteger('size'); // File size in bytes
            $table->string('path'); // Relative path within client's UUID folder

            // Metadata
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance and security
            $table->index('client_id');
            $table->index('folder_id');
            $table->index('extension');
            $table->index('created_at');

            // Ensure unique stored names
            $table->unique('stored_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_documents');
    }
};
