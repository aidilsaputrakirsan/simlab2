<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Prodi::insert([
            [
                'jurusan_id' => 3,
                'name' => 'Fisika'
            ],
            [
                'jurusan_id' => 1,
                'name' => 'Matematika'
            ],
            [
                'jurusan_id' => 4,
                'name' => 'Teknik Mesin'
            ],
            [
                'jurusan_id' => 4,
                'name' => 'Teknik Elektro'
            ],
            [
                'jurusan_id' => 4,
                'name' => 'Teknik Kimia'
            ],
            [
                'jurusan_id' => 2,
                'name' => 'Teknik Material dan Metalurgi'
            ],
            [
                'jurusan_id' => 5,
                'name' => 'Teknik Sipil'
            ],
            [
                'jurusan_id' => 5,
                'name' => 'Perencanaan Wilayah Kota'
            ],
            [
                'jurusan_id' => 3,
                'name' => 'Teknik Perkapalan'
            ],
            [
                'jurusan_id' => 1,
                'name' => 'Sistem Informasi'
            ],
            [
                'jurusan_id' => 1,
                'name' => 'Informatika'
            ],
            [
                'jurusan_id' => 4,
                'name' => 'Teknik Industri'
            ],
            [
                'jurusan_id' => 2,
                'name' => 'Teknik Lingkungan'
            ],
            [
                'jurusan_id' => 3,
                'name' => 'Teknik Kelautan',
            ],
            [
                'jurusan_id' => 5,
                'name' => 'Arsitektur'
            ],
            [
                'jurusan_id' => 3,
                'name' => 'Teknologi Pangan'
            ],
            [
                'jurusan_id' => 1,
                'name' => 'Statistika'
            ],
            [
                'jurusan_id' => 1,
                'name' => 'Ilmu Aktuaria'
            ],
            [
                'jurusan_id' => 1,
                'name' => 'Bisnis Digital'
            ],
            [
                'jurusan_id' => 4,
                'name' => 'Rekayasa Keselamatan'
            ],
            [
                'jurusan_id' => 5,
                'name' => 'Desain Komunikasi Visual'
            ],
            [
                'jurusan_id' => 4,
                'name' => 'Teknik Logistik'
            ]
        ]);
    }
}
