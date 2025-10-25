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
        Schema::create('client_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['phone_secondary', 'mobile_secondary', 'fax', 'email_secondary', 'pec', 'facebook', 'linkedin', 'other']);
            $table->string('value');
            $table->string('label')->nullable(); // Optional label like "Work", "Personal"
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index('client_id');
            $table->index(['client_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_contacts');
    }
};
