<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                "name" => "Admin (Erlina)",
                "email" => "labterpadu@itk.ac.id",
                "password" => bcrypt("123123"),
                "role" => "admin",
                "identity_num" => null,
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Admin Pengujian",
                "email" => "admin_pengujian@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "admin_pengujian",
                "identity_num" => null,
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Kepala Lab Terpadu",
                "email" => "kepalalab@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "kepala_lab_terpadu",
                "identity_num" => "2313321",
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Dosen",
                "email" => "dosen@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "dosen",
                "identity_num" => "198501012020",
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Koordinator Prodi",
                "email" => "koorprodi@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "koorprodi",
                "identity_num" => "198601012020",
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Kepala Lab Jurusan",
                "email" => "kepalalab_jurusan@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "kepala_lab_jurusan",
                "identity_num" => "198701012020",
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Laboran",
                "email" => "laboran@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "laboran",
                "identity_num" => null,
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Mahasiswa",
                "email" => "mahasiswa@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "mahasiswa",
                "identity_num" => "10221001",
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
            [
                "name" => "Pihak Luar",
                "email" => "pihakluar@gmail.com",
                "password" => bcrypt("123123"),
                "role" => "pihak_luar",
                "identity_num" => null,
                "study_program_id" => null,
                "institution_id" => null,
                "is_manager" => false,
                "is_active" => "Active",
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
