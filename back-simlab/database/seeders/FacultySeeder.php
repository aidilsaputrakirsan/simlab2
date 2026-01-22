<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faculties = [
            ['code' => 'FSTI', 'name' => 'Fakultas Sains dan Teknologi Informasi'],
            ['code' => 'FPB', 'name' => 'Fakultas Pembangunan Berkelanjutan'],
            ['code' => 'FRTI', 'name' => 'Fakultas Rekayasa dan Teknologi Industri'],
        ];

        foreach ($faculties as $faculty) {
            Faculty::firstOrCreate(['code' => $faculty['code']], $faculty);
        }
    }
}
