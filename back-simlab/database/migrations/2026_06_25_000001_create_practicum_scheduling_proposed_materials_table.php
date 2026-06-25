<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practicum_scheduling_proposed_materials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('practicum_scheduling_id');
            $table->string('name');
            $table->integer('quantity');
            $table->timestamps();

            // Nama constraint dipendekkan agar tidak melebihi batas 64 karakter MySQL
            $table->foreign('practicum_scheduling_id', 'psp_materials_scheduling_fk')
                ->references('id')->on('practicum_schedulings')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practicum_scheduling_proposed_materials');
    }
};
