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
        Schema::create('alat_laboratoria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruangan_laboratorium_id')->constrained()->onDelete('cascade');
            $table->string('equipment_name');
            $table->integer('quantity');
            $table->string('unit');
            $table->text('function')->nullable();
            $table->string('photo')->nullable();
            $table->string('brand');
            $table->string('equipment_type');
            $table->string('origin');
            $table->string('condition');
            $table->text('condition_description')->nullable();
            $table->string('asset_code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alat_laboratoria');
    }
};
