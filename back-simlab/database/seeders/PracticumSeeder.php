<?php

namespace Database\Seeders;

use App\Models\Practicum;
use App\Models\StudyProgram;
use Illuminate\Database\Seeder;

class PracticumSeeder extends Seeder
{
    public function run(): void
    {
        $prodiId = StudyProgram::first()->id ?? 1;

        Practicum::insert([
            ["code" => "IS23123", "name" => "Pemrogramman Web", "study_program_id" => $prodiId, "type" => "compulsory", "sks" => 3],
            ["code" => "IS31231", "name" => "Pemrogramman Beroriantasi Objek", "study_program_id" => $prodiId, "type" => "compulsory", "sks" => 3],
            ["code" => "IS33123", "name" => "Cloud Computing", "study_program_id" => $prodiId, "type" => "compulsory", "sks" => 2],
        ]);
    }
}
