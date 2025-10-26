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
        Schema::create('client_folders', function (Blueprint $table) {
            $table->id();

            // Foreign key to client
            $table->foreignId('client_id')->constrained()->onDelete('cascade');

            // Folder details
            $table->string('name'); // User-friendly folder name
            $table->string('path'); // Relative path within client's UUID folder
            $table->foreignId('parent_folder_id')->nullable()->constrained('client_folders')->onDelete('cascade');

            // Metadata
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('client_id');
            $table->index('parent_folder_id');

            // Ensure unique folder names per parent within client
            $table->unique(['client_id', 'parent_folder_id', 'name'], 'unique_folder_name_per_parent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_folders');
    }
};
