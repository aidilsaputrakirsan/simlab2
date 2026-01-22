<?php

namespace Database\Seeders;

use App\Models\Prodi;
use App\Models\StudyProgram;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudyProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = \App\Models\Major::pluck('id', 'name')->toArray();

        $m1 = $majors['Jurusan Sains dan Analitika Data'] ?? 1;
        $m2 = $majors['Jurusan Teknik Elektro, Informatika, dan Bisnis'] ?? 2;
        $m3 = $majors['Jurusan Teknologi Kemaritiman'] ?? 3;
        $m4 = $majors['Jurusan Teknik Sipil dan Perencanaan'] ?? 4;
        $m5 = $majors['Jurusan Teknologi Industri'] ?? 5;
        $m6 = $majors['Jurusan Rekayasa Industri'] ?? 6;

        $programs = [
            ['code' => '01', 'major_id' => $m1, 'name' => 'Fisika'],
            ['code' => '02', 'major_id' => $m1, 'name' => 'Matematika'],
            ['code' => '03', 'major_id' => $m5, 'name' => 'Teknik Mesin'],
            ['code' => '04', 'major_id' => $m2, 'name' => 'Teknik Elektro'],
            ['code' => '05', 'major_id' => $m6, 'name' => 'Teknik Kimia'],
            ['code' => '06', 'major_id' => $m5, 'name' => 'Teknik Material dan Metalurgi'],
            ['code' => '07', 'major_id' => $m4, 'name' => 'Teknik Sipil'],
            ['code' => '08', 'major_id' => $m4, 'name' => 'Perencanaan Wilayah Kota'],
            ['code' => '09', 'major_id' => $m3, 'name' => 'Teknik Perkapalan'],
            ['code' => '10', 'major_id' => $m2, 'name' => 'Sistem Informasi'],
            ['code' => '11', 'major_id' => $m2, 'name' => 'Informatika'],
            ['code' => '12', 'major_id' => $m5, 'name' => 'Teknik Industri'],
            ['code' => '13', 'major_id' => $m3, 'name' => 'Teknik Lingkungan'],
            ['code' => '14', 'major_id' => $m3, 'name' => 'Teknik Kelautan'],
            ['code' => '15', 'major_id' => $m4, 'name' => 'Arsitektur'],
            ['code' => '16', 'major_id' => $m6, 'name' => 'Teknologi Pangan'],
            ['code' => '17', 'major_id' => $m1, 'name' => 'Statistika'],
            ['code' => '18', 'major_id' => $m1, 'name' => 'Ilmu Aktuaria'],
            ['code' => '19', 'major_id' => $m2, 'name' => 'Bisnis Digital'],
            ['code' => '20', 'major_id' => $m6, 'name' => 'Rekayasa Keselamatan'],
            ['code' => '21', 'major_id' => $m4, 'name' => 'Desain Komunikasi Visual'],
            ['code' => '22', 'major_id' => $m5, 'name' => 'Teknik Logistik'],
        ];

        foreach ($programs as $program) {
            StudyProgram::firstOrCreate(['code' => $program['code']], $program);
        }
    }
}
