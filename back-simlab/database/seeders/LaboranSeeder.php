<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class LaboranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $laborans = [
            ['name' => 'Muhadi Reza Nanda', 'email' => 'muhadireza@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Made Yuri Suryani', 'email' => 'yurisuryani@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Andik Setiawan', 'email' => 'andik.setiawan@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Jian Adi Permana', 'email' => 'jian.adi@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Hanif Kurniawan', 'email' => 'kurniawan.hanif@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Hendro Susilo', 'email' => 'hendroin@staff.itk.ac.id', 'nip' => '100217040'],
            ['name' => 'Adhe Paramita', 'email' => 'adhe.paramita@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Syarifah Nihlah Yahya', 'email' => 'syarifahny@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Aries Rohiyanto', 'email' => 'aries.rohiyanto@staff.itk.ac.id', 'nip' => '197004211998021001'],
            ['name' => 'Agus Nurtriartono', 'email' => 'agus.nurtriartono@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Ridho Wibi Pradana', 'email' => 'ridho_wibi@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Wahyuni Harliyanti', 'email' => 'wahyuni@staff.itk.ac.id', 'nip' => '199008042021212001'],
            ['name' => 'Yudha Prasetyo', 'email' => 'yudha.prasetyo@staff.itk.ac.id', 'nip' => '198506262021211002'],
            ['name' => 'Teo Lukmanul Hakim', 'email' => 'teo.lukmanul@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Erlina Jatiningtyas', 'email' => 'erlina.jatiningtyas@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Putri Setya Rini', 'email' => 'putri.setya@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Rahmat Ramadhan', 'email' => 'rahmat.ramadhan@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Dita Dwi Setyoningsih', 'email' => 'dita.dwi@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Olivelia Novelina Ngabito', 'email' => 'olivelia.novelina@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Rani Marizah Amelia', 'email' => 'rani.marizah@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Olga Galih Rakha Siwi', 'email' => 'galih@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Franstiko Ahmad Syaifulloh', 'email' => 'franstiko.syaifulloh@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Muhamad Ramadan', 'email' => 'muhamad.ramadan@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Muhammad Daffa Rizky Ramadhansyah', 'email' => 'daffa.ramadhansyah@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Ade Rachmat Johar Pangestu', 'email' => 'ade.pangestu@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Tefani Ajeng Pramesty', 'email' => 'tefani.pramesty@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Fadholi Rahman Siregar', 'email' => 'fadholi.siregar@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Yunita Nilam Khoironi', 'email' => 'yunita.khoironi@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Nur Alya', 'email' => 'nur.alya@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Riska Apriliya Safitri', 'email' => 'riska.safitri@staff.itk.ac.id', 'nip' => '199804182025062011'],
            ['name' => 'Novianti Rossalina', 'email' => 'novianti.rossalina@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Maulana Maliki', 'email' => 'maulana.maliki@staff.itk.ac.id', 'nip' => null],
            ['name' => 'Rina Yusdiana', 'email' => 'rina.yusdiana@staff.itk.ac.id', 'nip' => null],
        ];

        foreach ($laborans as $laboran) {
            User::firstOrCreate(
                ['email' => $laboran['email']],
                [
                    'name' => $laboran['name'],
                    'email' => $laboran['email'],
                    'password' => bcrypt('123123'),
                    'role' => 'laboran',
                    'identity_num' => $laboran['nip'],
                    'study_program_id' => null,
                    'institution_id' => null,
                    'is_manager' => false,
                    'is_active' => 'Active',
                ]
            );
        }
    }
}
