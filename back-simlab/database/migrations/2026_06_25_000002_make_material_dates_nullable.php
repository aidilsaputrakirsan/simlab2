<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * purchase_date & refill_date dibuat nullable agar import bahan
     * (template menandai kedua tanggal sebagai opsional) tetap bisa masuk.
     * Memakai raw SQL karena project belum memuat doctrine/dbal untuk ->change().
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE laboratory_materials MODIFY purchase_date DATE NULL');
        DB::statement('ALTER TABLE laboratory_materials MODIFY refill_date DATE NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE laboratory_materials MODIFY purchase_date DATE NOT NULL');
        DB::statement('ALTER TABLE laboratory_materials MODIFY refill_date DATE NOT NULL');
    }
};
