<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Comprehensive bug_reports table with:
     * - User tracking
     * - Status management
     * - Browser/environment info for debugging
     * - Soft deletes for audit trail
     */
    public function up(): void
    {
        Schema::create('bug_reports', function (Blueprint $table) {
            $table->id();

            // User who reported the bug
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Bug details
            $table->timestamp('report_date');
            $table->text('bug_description');

            // Status tracking for bug lifecycle management
            $table->enum('status', ['new', 'in_progress', 'resolved', 'closed'])->default('new');

            // Priority for future triage (optional, can be null initially)
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->nullable();

            // Technical debugging information
            $table->text('browser_info')->nullable();
            $table->string('url', 500)->nullable();
            $table->string('ip_address', 45)->nullable();

            // Timestamps and soft deletes
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
            $table->index('report_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bug_reports');
    }
};
