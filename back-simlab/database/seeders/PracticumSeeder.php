<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Practicum;
use App\Models\PracticumScheduling;
use App\Models\PracticumClass;
use App\Models\StudyProgram;
use App\Models\AcademicYear;
use App\Models\User;
use App\Models\LaboratoryRoom;

class PracticumSeeder extends Seeder
{
    private $prodiMap = [];
    private $userMap = []; // old_id => new_user_model
    private $practicumMap = []; // old_id => new_id
    private $scheduleMap = []; // code => new_id
    private $roomMap = []; // old_id => new_id (loaded from previous room migration if possible, or lookup by name)

    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        PracticumClass::truncate();
        PracticumScheduling::truncate();
        Practicum::truncate();
        Schema::enableForeignKeyConstraints();

        $this->loadProdiMap();
        $this->loadUserMap();
        $this->loadRoomMap();

        $this->seedPracticums();
        $this->seedSchedules();
        $this->seedClasses();
    }

    private function loadProdiMap()
    {
        $json = file_get_contents(__DIR__ . '/data/prodi_data.json');
        $prodis = json_decode($json, true);

        foreach ($prodis as $p) {
            $name = $p['nama_prodi'];
            $dbProdi = StudyProgram::where('name', 'LIKE', '%' . $name . '%')->first();
            if ($dbProdi) {
                $this->prodiMap[$p['kode_prodi']] = $dbProdi->id;
            }
        }
    }

    private function loadUserMap()
    {
        $json = file_get_contents(__DIR__ . '/data/user_mapping.json');
        $users = json_decode($json, true);

        $idToEmail = [];
        foreach ($users as $u) {
            if (isset($u['email']) && !empty($u['email'])) {
                $idToEmail[$u['id']] = $u['email'];
            }
        }

        $existingUsers = User::pluck('id', 'email')->toArray();

        foreach ($idToEmail as $oldId => $email) {
            if (isset($existingUsers[$email])) {
                $this->userMap[$oldId] = $existingUsers[$email];
            }
        }
    }

    private function loadRoomMap()
    {
        $json = file_get_contents(__DIR__ . '/data/room_data.json');
        $rooms = json_decode($json, true);

        $dbRooms = LaboratoryRoom::pluck('id', 'name')->toArray();

        foreach ($rooms as $r) {
            $name = $r['nama_ruangan'];
            if (isset($dbRooms[$name])) {
                $this->roomMap[$r['id_ruangan_laboratorium']] = $dbRooms[$name];
            }
        }
    }

    private function seedPracticums()
    {
        $json = file_get_contents(__DIR__ . '/data/practicum_data.json');
        $data = json_decode($json, true);

        foreach ($data as $item) {
            if (!isset($this->prodiMap[$item['kode_prodi']]))
                continue;

            $practicum = Practicum::create([
                'code' => null, // Old data doesn't have course codes
                'name' => $item['nama_praktikum'],
                'sks' => (int) $item['sks'],
                'study_program_id' => $this->prodiMap[$item['kode_prodi']],
                'type' => 'compulsory',
            ]);

            $this->practicumMap[$item['id_praktikum_matkul']] = $practicum->id;
        }
        $this->command->info("Seeded " . count($this->practicumMap) . " practicums.");
    }

    private function seedSchedules()
    {
        $json = file_get_contents(__DIR__ . '/data/scheduling_header_data.json');
        $data = json_decode($json, true);
        $count = 0;

        foreach ($data as $item) {
            if (!isset($this->practicumMap[$item['id_praktikum_matkul']]))
                continue;

            $yearId = $this->getAcademicYearId($item['kode_tahun_akademik']);

            $userId = $this->userMap[$item['id_user_penjadwalan']] ?? null;
            if (!$userId)
                continue;

            $laboranId = $this->userMap[$item['id_penanggung_jawab_laboran'] ?? ''] ?? null;

            $status = match ($item['status_jadwal']) {
                'Telah Diverifikasi' => 'approved',
                'Ditolak' => 'rejected',
                default => 'pending'
            };

            $schedule = PracticumScheduling::create([
                'academic_year_id' => $yearId,
                'user_id' => $userId,
                'laboran_id' => $laboranId,
                'practicum_id' => $this->practicumMap[$item['id_praktikum_matkul']],
                'phone_number' => substr($item['nomor_telepon'] ?? '00000', 0, 14),
                'status' => $status,
                'created_at' => $item['created_at'],
                'updated_at' => $item['updated_at'],
            ]);

            $this->scheduleMap[$item['kode_penjadwalan_laboratorium']] = $schedule->id;
            $count++;
        }
        $this->command->info("Seeded $count schedules.");
    }

    private function seedClasses()
    {
        $json = file_get_contents(__DIR__ . '/data/group_data.json');
        $data = json_decode($json, true);
        $count = 0;

        $headerJson = file_get_contents(__DIR__ . '/data/scheduling_header_data.json');
        $headers = json_decode($headerJson, true);
        $headerRoomMap = [];
        $headerLecturerId = [];
        foreach ($headers as $h) {
            $headerRoomMap[$h['kode_penjadwalan_laboratorium']] = $h['id_ruangan_laboratorium'];
            $headerLecturerId[$h['kode_penjadwalan_laboratorium']] = $h['id_user_penjadwalan'];
        }

        foreach ($data as $item) {
            $scheduleCode = $item['kode_penjadwalan_laboratorium'];
            if (!isset($this->scheduleMap[$scheduleCode]))
                continue;

            $scheduleId = $this->scheduleMap[$scheduleCode];

            $oldRoomId = $headerRoomMap[$scheduleCode] ?? null;
            $newRoomId = $this->roomMap[$oldRoomId] ?? null;

            $oldLecturerId = $headerLecturerId[$scheduleCode] ?? null;
            $newLecturerId = $this->userMap[$oldLecturerId] ?? null;

            if (!$newRoomId || !$newLecturerId)
                continue;

            PracticumClass::create([
                'practicum_scheduling_id' => $scheduleId,
                'lecturer_id' => $newLecturerId,
                'laboratory_room_id' => $newRoomId,
                'name' => $item['nama_kelompok'] ?? 'Group',
                'practicum_assistant' => $item['asisten_praktikum'] ?? '-',
                'total_participant' => (int) ($item['jumlah_praktikkan'] ?? 0),
                'total_group' => 1,
                'created_at' => $item['created_at'],
                'updated_at' => $item['updated_at'],
            ]);
            $count++;
        }
        $this->command->info("Seeded $count classes.");
    }

    private function getAcademicYearId($code)
    {
        // code e.g. "20221" => 2022/2023 Ganjil
        // "20222" => 2022/2023 Genap
        if (strlen($code) < 5)
            return AcademicYear::firstOrCreate(['name' => 'Unknown'])->id;

        $yearStart = substr($code, 0, 4);
        $semesterCode = substr($code, 4, 1);

        $nextYear = (int) $yearStart + 1;
        $semesterLabel = ($semesterCode == '1') ? 'Ganjil' : 'Genap';
        $name = "$yearStart/$nextYear $semesterLabel";

        return AcademicYear::firstOrCreate(
            ['name' => $name],
            ['status' => ($name == '2025/2026 Genap') ? 'Active' : 'Deactive']
        )->id;
    }
}
