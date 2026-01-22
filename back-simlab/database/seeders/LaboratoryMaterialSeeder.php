<?php

namespace Database\Seeders;

use App\Models\LaboratoryMaterial;
use Illuminate\Database\Seeder;

class LaboratoryMaterialSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        LaboratoryMaterial::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $this->command->info('Loading material data from JSON...');

        // 1. Load Material Data
        $materialJsonPath = database_path('seeders/data/material_data.json');
        if (!file_exists($materialJsonPath)) {
            $this->command->error("File material_data.json not found!");
            return;
        }
        $materials = json_decode(file_get_contents($materialJsonPath), true);

        // 2. Process Material
        foreach ($materials as $material) {
            // Validate required data
            if (empty($material['kode_bahan']) || empty($material['nama_bahan']))
                continue;

            LaboratoryMaterial::updateOrCreate(
                ['code' => $material['kode_bahan']],
                [
                    'code' => $material['kode_bahan'],
                    'material_name' => $material['nama_bahan'],
                    'brand' => $material['merek'] ?? '-',
                    'stock' => (int) ($material['stok_bahan'] ?? 0),
                    'unit' => $material['satuan_bahan'] ?? 'Unit',
                    'purchase_date' => $this->parseDate($material['tanggal_beli_bahan']),
                    'expiry_date' => $this->parseDate($material['tanggal_kadaluarsa_bahan']),
                    'description' => $material['keterangan_bahan'],
                    'refill_date' => $this->parseDate($material['tanggal_pengisian_bahan']),
                    'student_price' => 0,
                    'lecturer_price' => 0,
                    'external_price' => 0,
                    'created_at' => $material['created_at'] ?? now(),
                    'updated_at' => $material['updated_at'] ?? now(),
                ]
            );
        }
    }

    private function parseDate($dateString)
    {
        if (empty($dateString) || $dateString === '0000-00-00' || $dateString === '-') {
            return now(); // Or null if nullable, but migration might require date
            // Looking at migration: purchase_date is NOT NULL, refill_date is NOT NULL.
            // Expiry date is nullable.
        }
        // Try simple parse
        try {
            return \Carbon\Carbon::parse($dateString);
        } catch (\Exception $e) {
            return now();
        }
    }
}
