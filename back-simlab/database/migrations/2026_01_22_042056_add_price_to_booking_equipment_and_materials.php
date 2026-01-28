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
        Schema::table('booking_equipment', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->default(0)->after('quantity');
        });

        Schema::table('booking_materials', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->default(0)->after('quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_equipment', function (Blueprint $table) {
            $table->dropColumn('price');
        });

        Schema::table('booking_materials', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
