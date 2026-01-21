<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LaboratoryRoom;
use App\Models\User;

class LaboratoryRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Mapping id_laboran lama ke email laboran
        $laboranEmailMapping = [
            52 => 'muhadireza@staff.itk.ac.id',
            53 => 'yurisuryani@staff.itk.ac.id',
            54 => 'andik.setiawan@staff.itk.ac.id',
            55 => 'jian.adi@staff.itk.ac.id',
            58 => 'kurniawan.hanif@staff.itk.ac.id',
            61 => null, // tidak ada di laboran seeder
            63 => 'hendroin@staff.itk.ac.id',
            66 => 'adhe.paramita@staff.itk.ac.id',
            67 => null, // tidak ada di laboran seeder
            71 => 'syarifahny@staff.itk.ac.id',
            74 => 'aries.rohiyanto@staff.itk.ac.id',
            87 => 'agus.nurtriartono@staff.itk.ac.id',
            194 => 'ridho_wibi@staff.itk.ac.id',
            214 => 'wahyuni@staff.itk.ac.id',
            215 => 'yudha.prasetyo@staff.itk.ac.id',
            516 => 'teo.lukmanul@staff.itk.ac.id',
            799 => 'erlina.jatiningtyas@staff.itk.ac.id',
            2162 => 'putri.setya@staff.itk.ac.id',
            2163 => 'rahmat.ramadhan@staff.itk.ac.id',
            2164 => 'dita.dwi@staff.itk.ac.id',
            2165 => 'olivelia.novelina@staff.itk.ac.id',
            2378 => 'rani.marizah@staff.itk.ac.id',
            2970 => 'rina.yusdiana@staff.itk.ac.id',
        ];

        // Get laboran user IDs by email
        $laboranIds = [];
        foreach ($laboranEmailMapping as $oldId => $email) {
            if ($email) {
                $user = User::where('email', $email)->first();
                $laboranIds[$oldId] = $user?->id;
            } else {
                $laboranIds[$oldId] = null;
            }
        }

        // Default laboran jika tidak ditemukan
        $defaultLaboranId = User::where('role', 'laboran')->first()?->id
            ?? User::first()?->id;

        $rooms = [
            // Labter 1 - Lantai 1
            ['name' => 'Labter 1 - Bengkel A - Manufaktur (R101)', 'floor' => 'Lantai 1', 'laboran_old_id' => 74],
            ['name' => 'Labter 1 - Bengkel B - Perakitan (R102)', 'floor' => 'Lantai 1', 'laboran_old_id' => 87],
            ['name' => 'Labter 1 - Lab. Rekayasa Konstruksi dan Transportasi (R103)', 'floor' => 'Lantai 1', 'laboran_old_id' => 63],
            ['name' => 'Labter 1 - Lab. Uji Destruktif dan Non Destruktif (R104)', 'floor' => 'Lantai 1', 'laboran_old_id' => 52],
            ['name' => 'Labter 1 - Lab. Teknologi Proses (R105)', 'floor' => 'Lantai 1', 'laboran_old_id' => 2162],
            ['name' => 'Labter 1 - Lab. Sistem Tenaga Listrik dan Otomasi (R106)', 'floor' => 'Lantai 1', 'laboran_old_id' => 58],
            ['name' => 'Labter 1 - Lab. Karakterisasi A (R107)', 'floor' => 'Lantai 1', 'laboran_old_id' => 53],
            ['name' => 'Labter 1 - Lab. Karakterisasi B (R108)', 'floor' => 'Lantai 1', 'laboran_old_id' => 66],
            ['name' => 'Labter 1 - Lab. Termal (R109)', 'floor' => 'Lantai 1', 'laboran_old_id' => 52],
            ['name' => 'Labter 1 - Gudang Bahan A (R110)', 'floor' => 'Lantai 1', 'laboran_old_id' => 215],

            // Labter 1 - Lantai 2
            ['name' => 'Labter 1 - Lab. Kimia Dasar A (R201)', 'floor' => 'Lantai 2', 'laboran_old_id' => 53],
            ['name' => 'Labter 1 - Lab. Fisika Dasar A (R202)', 'floor' => 'Lantai 2', 'laboran_old_id' => 2163],
            ['name' => 'Labter 1 - Ruang Kerja Bersama A (R205)', 'floor' => 'Lantai 2', 'laboran_old_id' => 799],
            ['name' => 'Labter 1 - Ruang Kerja Bersama B (R206)', 'floor' => 'Lantai 2', 'laboran_old_id' => 799],
            ['name' => 'Labter 1 - Lab. Fisika Dasar B (R207)', 'floor' => 'Lantai 2', 'laboran_old_id' => 2163],
            ['name' => 'Labter 1 - Lab. Kimia Dasar B (R208)', 'floor' => 'Lantai 2', 'laboran_old_id' => 53],

            // Labter 1 - Lantai 3
            ['name' => 'Labter 1 - Lab. Komputer A (R301)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 1 - Lab. Komputer B (R302)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 1 - Lab. Komputer C (R303)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 1 - Lab. Komputer D (R304)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 1 - Lab. Komputer E (R305)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 1 - Lab. Komputer F (R306)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 1 - Lab. Komputer G (R307)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],

            // Labter 2 - Lantai 1
            ['name' => 'Labter 2 - Lab. Karakterisasi C (R101)', 'floor' => 'Lantai 1', 'laboran_old_id' => 66],
            ['name' => 'Labter 2 - Lab. Operasi Teknologi Kimia (R102)', 'floor' => 'Lantai 1', 'laboran_old_id' => 66],
            ['name' => 'Labter 2 - Lab. Rekayasa Lingkungan & Pengolahan Limbah (R103)', 'floor' => 'Lantai 1', 'laboran_old_id' => 55],
            ['name' => 'Labter 2 - Gudang Bahan B (R104)', 'floor' => 'Lantai 1', 'laboran_old_id' => 215],
            ['name' => 'Labter 2 - Gudang Bahan C (R105)', 'floor' => 'Lantai 1', 'laboran_old_id' => 215],
            ['name' => 'Labter 2 - Lab. Rekayasa Industri dan Ergonomi (R106)', 'floor' => 'Lantai 1', 'laboran_old_id' => 516],
            ['name' => 'Labter 2 - Lab. Rekayasa Keselamatan (R107)', 'floor' => 'Lantai 1', 'laboran_old_id' => 516],
            ['name' => 'Labter 2 - Lab. Proses Produksi (R108)-A', 'floor' => 'Lantai 1', 'laboran_old_id' => 74],
            ['name' => 'Labter 2 - Lab. Proses Produksi (R108)-B/DT-NDT', 'floor' => 'Lantai 1', 'laboran_old_id' => 52],
            ['name' => 'Labter 2 - Lab. Permesinan dan Konversi Energi (R109)', 'floor' => 'Lantai 1', 'laboran_old_id' => 54],
            ['name' => 'Labter 2 - Lab. Konstruksi Bangunan Laut (R115)', 'floor' => 'Lantai 1', 'laboran_old_id' => 54],
            ['name' => 'Labter 2 - Lab. Geoteknik dan Ukur Tanah (R116)', 'floor' => 'Lantai 1', 'laboran_old_id' => 63],
            ['name' => 'Labter 2 - Lab. Hidrodinamika dan Aerodinamika (R118)', 'floor' => 'Lantai 1', 'laboran_old_id' => 54],

            // Labter 2 - Lantai 2
            ['name' => 'Labter 2 - Lab. Pusat Penelitian Energi (R201)', 'floor' => 'Lantai 2', 'laboran_old_id' => 2378],
            ['name' => 'Labter 2 - Lab. Kimia Material (R202)', 'floor' => 'Lantai 2', 'laboran_old_id' => 214],
            ['name' => 'Labter 2 - Lab. Pusat Penelitian Pangan Pertanian (R203)', 'floor' => 'Lantai 2', 'laboran_old_id' => 799],
            ['name' => 'Labter 2 - Lab Teknologi Pangan (R204)', 'floor' => 'Lantai 2', 'laboran_old_id' => 799],
            ['name' => 'Labter 2 - Kantor Administrasi (R205)', 'floor' => 'Lantai 2', 'laboran_old_id' => 799],
            ['name' => 'Labter 2 - Lab Logistik & Manajemen Rantai Pasok (R206)', 'floor' => 'Lantai 2', 'laboran_old_id' => 516],
            ['name' => 'Labter 2 - Ruang Seminar (R207)', 'floor' => 'Lantai 2', 'laboran_old_id' => 2165],
            ['name' => 'Labter 2 - Lab Mikrobiologi Pangan', 'floor' => 'Lantai 2', 'laboran_old_id' => 2970],
            ['name' => 'Labter 2 - Lab Biokimia Pangan', 'floor' => 'Lantai 2', 'laboran_old_id' => 2970],
            ['name' => 'Labter 2 - Lab Sensori Pangan', 'floor' => 'Lantai 2', 'laboran_old_id' => 2970],

            // Labter 2 - Lantai 3
            ['name' => 'Labter 2 - Fisika Lanjut (R301)', 'floor' => 'Lantai 3', 'laboran_old_id' => 71],
            ['name' => 'Labter 2 - Lab Fisika Lanjut (R301)', 'floor' => 'Lantai 3', 'laboran_old_id' => 2163],
            ['name' => 'Labter 2 - Lab Elektronika dan Robotika (R302)', 'floor' => 'Lantai 3', 'laboran_old_id' => 58],
            ['name' => 'Labter 2 - Lab Komputasi Tinggi (R303)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 2 - Lab Telekomunikasi dan Jaringan Komputer (R304)', 'floor' => 'Lantai 3', 'laboran_old_id' => 58],
            ['name' => 'Labter 2 - Lab Pengembangan Perangkat Lunak (R305)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],
            ['name' => 'Labter 2 - Studio Perencanaan Tata Ruang (R306)', 'floor' => 'Lantai 3', 'laboran_old_id' => 2164],
            ['name' => 'Labter 2 - Studio Arsitektur dan Desain (R307)', 'floor' => 'Lantai 3', 'laboran_old_id' => 2164],
            ['name' => 'Labter 2 - Lab Pusat Penelitian Smart City (R308)', 'floor' => 'Lantai 3', 'laboran_old_id' => 194],

            // Workshop & Lainnya
            ['name' => 'Workshop B - Tuning & Assembly (1.5)', 'floor' => 'Lantai 1', 'laboran_old_id' => 61],
            ['name' => 'Laboratorium Industri (Lab205)', 'floor' => 'Lantai 2', 'laboran_old_id' => 67],
        ];

        foreach ($rooms as $room) {
            $userId = $laboranIds[$room['laboran_old_id']] ?? $defaultLaboranId;

            LaboratoryRoom::firstOrCreate(
                ['name' => $room['name']],
                [
                    'name' => $room['name'],
                    'floor' => $room['floor'],
                    'user_id' => $userId,
                    'student_price' => 0,
                    'lecturer_price' => 0,
                    'external_price' => 0,
                ]
            );
        }
    }
}
