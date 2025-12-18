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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payable_id');
            $table->string('payable_type');
            $table->index(['payable_type', 'payable_id'], 'payable_index');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('payment_number')->nullable();
            $table->integer('amount')->nullable();
            $table->string('invoice_file')->nullable();
            $table->string('payment_proof')->nullable();
            $table->string('va_number')->nullable();
            $table->enum('status', ['draft','rejected', 'approved', 'pending'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
