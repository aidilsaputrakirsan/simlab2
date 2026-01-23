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
        Schema::table('practicum_classes', function (Blueprint $table) {
            $table->string('practicum_assistant')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('practicum_classes', function (Blueprint $table) {
            $table->string('practicum_assistant')->nullable(false)->change();
        });
    }
};
