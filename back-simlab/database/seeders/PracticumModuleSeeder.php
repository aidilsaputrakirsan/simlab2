<?php

namespace Database\Seeders;

use App\Models\PracticumModule;
use App\Models\Practicum;
use Illuminate\Database\Seeder;

class PracticumModuleSeeder extends Seeder
{
    public function run(): void
    {
        $practicums = Practicum::pluck("id")->toArray();
        $p1 = $practicums[0] ?? 1;
        $p2 = $practicums[1] ?? $p1;
        $p3 = $practicums[2] ?? $p1;

        PracticumModule::insert([
            ["practicum_id" => $p1, "name" => "Pengantar pemrogramman web", "status" => "active"],
            ["practicum_id" => $p1, "name" => "HTML & CSS", "status" => "active"],
            ["practicum_id" => $p2, "name" => "Pengantar pemrogramman berorientasi objek", "status" => "active"],
            ["practicum_id" => $p2, "name" => "Class & Attribute", "status" => "active"],
            ["practicum_id" => $p3, "name" => "Pengantar cloud computing", "status" => "active"],
            ["practicum_id" => $p3, "name" => "PAAS & SAAS", "status" => "active"],
        ]);
    }
}
