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
        Schema::create('bahan_laboratoria', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('ruangan_laboratorium_id')->constrained()->onDelete('cascade');
            $table->string('material_name');
            $table->string('brand')->nullable();
            $table->integer('stock');
            $table->string('unit');
            $table->date('purchase_date');
            $table->date('expiry_date')->nullable();
            $table->text('description')->nullable();
            $table->date('refill_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bahan_laboratoria');
    }
};
