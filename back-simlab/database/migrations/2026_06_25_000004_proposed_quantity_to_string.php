<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Quantity untuk item USULAN (alat & bahan) menjadi teks bebas agar
     * pengusul bisa menulis angka + satuan sekaligus (mis. "500 ml", "2 set").
     *
     * - practicum_scheduling_proposed_materials.quantity : tabel khusus bahan usulan.
     * - practicum_scheduling_equipment.quantity         : dipakai bersama alat reguler,
     *   namun kolom ini hanya ditampilkan (tidak dipakai perhitungan) pada penjadwalan praktikum.
     *
     * Memakai raw SQL karena project belum memuat doctrine/dbal untuk ->change().
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE practicum_scheduling_proposed_materials MODIFY quantity VARCHAR(100) NOT NULL');
        DB::statement('ALTER TABLE practicum_scheduling_equipment MODIFY quantity VARCHAR(100) NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE practicum_scheduling_proposed_materials MODIFY quantity INT NOT NULL');
        DB::statement('ALTER TABLE practicum_scheduling_equipment MODIFY quantity INT NOT NULL');
    }
};
