<?php

namespace Database\Seeders;

use App\Models\LaboratoryEquipment;
use App\Models\LaboratoryRoom;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class LaboratoryEquipmentSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        LaboratoryEquipment::truncate();
        Schema::enableForeignKeyConstraints();

        $this->command->info('Loading equipment data from JSON...');

        // 1. Load Room Data (Old ID -> Name mapping)
        $roomJsonPath = database_path('seeders/data/room_data.json');
        if (!file_exists($roomJsonPath)) {
            $this->command->error("File room_data.json not found!");
            return;
        }
        $roomData = json_decode(file_get_contents($roomJsonPath), true);

        // Map Old Room ID => Room Name
        $roomIdToName = [];
        foreach ($roomData as $room) {
            if (isset($room['id_ruangan_laboratorium']) && isset($room['nama_ruangan'])) {
                $roomIdToName[$room['id_ruangan_laboratorium']] = $room['nama_ruangan'];
            }
        }

        // 2. Load Equipment Data
        $equipmentJsonPath = database_path('seeders/data/equipment_data.json');
        if (!file_exists($equipmentJsonPath)) {
            $this->command->error("File equipment_data.json not found!");
            return;
        }
        $equipments = json_decode(file_get_contents($equipmentJsonPath), true);

        // 3. Process Equipment
        foreach ($equipments as $equipment) {
            // Validate required data
            if (empty($equipment['nama_alat']))
                continue;

            // Find New Room ID
            $oldRoomId = $equipment['id_ruangan_laboratorium'] ?? null;
            $roomName = $roomIdToName[$oldRoomId] ?? null;

            $roomId = null;
            if ($roomName) {
                $room = LaboratoryRoom::where('name', $roomName)->first();
                $roomId = $room?->id;
            }
            // Fallback to first room if not found
            if (!$roomId) {
                $roomId = LaboratoryRoom::first()?->id ?? 1;
            }

            // Generate asset code if missing - USE DETERMINISTIC ID based on old DB ID
            $assetCode = $equipment['kode_aset'];
            if (empty($assetCode) || $assetCode === '-' || $assetCode === 'null') {
                // Use UNK- + ID. Old ID is unique.
                $oldId = $equipment['id_alat_lab'] ?? '0';
                $assetCode = 'UNK-' . $oldId;
            }

            // Ensure unique asset_code if collision (unlikely if using old ID)
            // But if 'kode_aset' was provided and duplicates exist in old DB?
            // updateOrCreate handles duplicates by updating.
            // But if we want to insert ALL records, and they have same asset_code?
            // The old DB allowed duplicates in asset_code? Probably not if it's not unique key there?
            // If old DB allows duplicates, we should use different keys.
            // Let's assume asset_code should be unique.

            LaboratoryEquipment::updateOrCreate(
                ['asset_code' => $assetCode],
                [
                    'laboratory_room_id' => $roomId,
                    'equipment_name' => $equipment['nama_alat'],
                    'quantity' => (int) ($equipment['jumlah'] ?? 0),
                    'unit' => $equipment['satuan'] ?? 'Unit',
                    'function' => $equipment['fungsi_alat'],
                    'photo' => $equipment['foto_alat'],
                    'brand' => $equipment['merek_alat'] ?? '-',
                    'equipment_type' => $equipment['jenis_alat'] ?? '-',
                    'origin' => $equipment['asal_alat'] ?? '-',
                    'condition' => $equipment['kondisi_alat'] ?? 'Unknown',
                    'condition_description' => $equipment['keterangan_kondisi_alat'],
                    'asset_code' => $assetCode,
                    'student_price' => 0,
                    'lecturer_price' => 0,
                    'external_price' => 0,
                    'created_at' => $equipment['created_at'] ?? now(),
                    'updated_at' => $equipment['updated_at'] ?? now(),
                ]
            );
        }
    }
}
