<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('testing_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('testing_category_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('unit')->nullable();
            $table->integer('student_price')->default(0);
            $table->integer('lecturer_price')->default(0);
            $table->integer('external_price')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testing_types');
    }
};
