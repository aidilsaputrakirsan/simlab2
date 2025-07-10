<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Jurusan::insert([
            [
                'major_code' => 'JMTI',
                'name' => 'Jurusan Matematika & Teknologi Informasi'
            ],
            [
                'major_code' => 'JIKL',
                'name' => 'Jurusan Ilmu Kebumian & Lingkungan'
            ],
            [
                'major_code' => 'JTSPK',
                'name' => 'Jurusan Sains, Teknologi Pangan, dan Kemaritiman'
            ],
            [
                'major_code' => 'JTIP',
                'name' => 'Jurusan Teknik Industri dan Proses'
            ],
            [
                'major_code' => 'JTSP',
                'name' => 'Jurusan Teknik Sipil dan Perncanaan'
            ]
        ]);
    }
}
