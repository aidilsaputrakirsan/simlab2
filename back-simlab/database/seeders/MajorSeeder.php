<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faculties = \App\Models\Faculty::pluck('id', 'code')->toArray();

        $majors = [
            ['code' => null, 'name' => 'Jurusan Sains dan Analitika Data', 'faculty_id' => $faculties['FSTI'] ?? 1],
            ['code' => null, 'name' => 'Jurusan Teknik Elektro, Informatika, dan Bisnis', 'faculty_id' => $faculties['FSTI'] ?? 1],
            ['code' => null, 'name' => 'Jurusan Teknologi Kemaritiman', 'faculty_id' => $faculties['FPB'] ?? 2],
            ['code' => null, 'name' => 'Jurusan Teknik Sipil dan Perencanaan', 'faculty_id' => $faculties['FPB'] ?? 2],
            ['code' => null, 'name' => 'Jurusan Teknologi Industri', 'faculty_id' => $faculties['FRTI'] ?? 3],
            ['code' => null, 'name' => 'Jurusan Rekayasa Industri', 'faculty_id' => $faculties['FRTI'] ?? 3],
        ];

        foreach ($majors as $major) {
            Major::firstOrCreate(['name' => $major['name']], $major);
        }
    }
}
