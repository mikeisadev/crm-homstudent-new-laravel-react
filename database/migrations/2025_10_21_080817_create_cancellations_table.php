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
        Schema::create('cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->date('cancellation_date');
            $table->enum('requested_by', ['client', 'owner', 'company']);
            $table->text('reason')->nullable();
            $table->date('notice_given_date')->nullable();
            $table->date('effective_date');
            $table->decimal('penalty_amount', 10, 2)->default(0);
            $table->decimal('deposit_refund_amount', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('contract_id');
            $table->index('cancellation_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancellations');
    }
};
