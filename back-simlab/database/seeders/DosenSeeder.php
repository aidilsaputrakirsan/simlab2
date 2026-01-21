<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\StudyProgram;
use Illuminate\Database\Seeder;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Mapping kode_prodi lama ke nama study program
        $prodiMapping = [
            '01' => 'Fisika',
            '02' => 'Matematika',
            '03' => 'Teknik Mesin',
            '04' => 'Teknik Elektro',
            '05' => 'Teknik Kimia',
            '06' => 'Teknik Material dan Metalurgi',
            '07' => 'Teknik Sipil',
            '08' => 'Perencanaan Wilayah Kota',
            '09' => 'Teknik Perkapalan',
            '10' => 'Sistem Informasi',
            '11' => 'Informatika',
            '12' => 'Teknik Industri',
            '13' => 'Teknik Lingkungan',
            '14' => 'Teknik Kelautan',
            '15' => 'Arsitektur',
            '16' => 'Teknologi Pangan',
            '17' => 'Statistika',
            '18' => 'Ilmu Aktuaria',
            '19' => 'Bisnis Digital',
            '20' => 'Rekayasa Keselamatan',
            '21' => 'Desain Komunikasi Visual',
            '22' => 'Teknik Logistik',
            '23' => 'Sains Data', // asumsi untuk kode 23
        ];

        // Get study program IDs
        $studyPrograms = StudyProgram::pluck('id', 'name')->toArray();

        $dosens = [
            // Fisika (01)
            ['name' => 'Dian Mart Shoodiqin', 'email' => 'dianms@lecturer.itk.ac.id', 'kode' => '01', 'nip' => null],
            ['name' => 'Swastya Rahastama', 'email' => 'swastya.r@lecturer.itk.ac.id', 'kode' => '01', 'nip' => null],
            ['name' => 'Agus Rifani, S.Si., M.Si.', 'email' => 'agusrifani@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '198408042012121006'],
            ['name' => 'Dr. Musyarofah', 'email' => 'musyarofah@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '100320221'],
            ['name' => 'Atut Reni Septiana', 'email' => 'atutrenis.fi@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '199109232018032001'],
            ['name' => 'Menasita', 'email' => 'menasita@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '198706282022032006'],
            ['name' => 'Harrys Samosir', 'email' => 'harrys.samosir@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '19920132024061001'],
            ['name' => 'Chairoh Ulfah', 'email' => 'chairoh.ulfah@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '199901142025062010'],
            ['name' => 'Pradiota Erlangga', 'email' => 'mbehe@lecturer.itk.ac.id', 'kode' => '01', 'nip' => '199002232019031004'],

            // Matematika (02)
            ['name' => 'Indira Anggriani', 'email' => 'indira@lecturer.itk.ac.id', 'kode' => '02', 'nip' => '199206222019032020'],
            ['name' => 'Aditya Putra Pratama', 'email' => 'adityapp@lecturer.itk.ac.id', 'kode' => '02', 'nip' => '100118146'],
            ['name' => 'Muliady Faisal, S.Si., M.Si.', 'email' => 'muliadyfaisal@lecturer.itk.ac.id', 'kode' => '02', 'nip' => '198406232019031010'],
            ['name' => 'Retno Wahyu Dewanti', 'email' => 'retnowahyu@lecturer.itk.ac.id', 'kode' => '02', 'nip' => '198902032015042002'],
            ['name' => 'Adam', 'email' => 'adam@lecturer.itk.ac.id', 'kode' => '02', 'nip' => '199807242022031009'],
            ['name' => 'M. Januar Ismail Burhan', 'email' => 'januarismail@lecturer.itk.ac.id', 'kode' => '02', 'nip' => null],

            // Teknik Mesin (03)
            ['name' => 'Andi Idhil Ismail', 'email' => 'a.idhil@lecturer.itk.ac.id', 'kode' => '03', 'nip' => null],
            ['name' => 'Hadhimas Dwi Haryono', 'email' => 'hadhimas@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '198805072019031001'],
            ['name' => 'Alfian Djafar', 'email' => 'alfian.djafar@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '198705162019031014'],
            ['name' => 'Illa Rizianiza', 'email' => 'rizianiza@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '198805062018032001'],
            ['name' => 'Chaerul Qalbi AM S.T., M.Sc', 'email' => 'chaerul.qalbi@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '100321282'],
            ['name' => 'Diniar Mungil Kurniawati', 'email' => 'diniarmungil@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '100118162'],
            ['name' => 'Faisal Manta', 'email' => 'faisal86@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '198606152018031001'],
            ['name' => 'Kholiq Deliasgarin Radyantho', 'email' => 'kholiq.radyantho@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '1991171212022031006'],
            ['name' => 'Devy Setiorini Sa\'adiyah', 'email' => 'devysetiorini@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '100116071'],
            ['name' => 'I Made Ivan Wiyarta Cakra Sujana', 'email' => 'made.sujana@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '199609282024061001'],
            ['name' => 'Yongki Christandi Batubara', 'email' => 'yongki.batubara@lecturer.itk.ac.id', 'kode' => '03', 'nip' => '199612092024061002'],

            // Teknik Elektro (04)
            ['name' => 'Adi Mahmud Jaya Marindra', 'email' => 'adi.marindra@lecturer.itk.ac.id', 'kode' => '04', 'nip' => null],
            ['name' => 'Barokatun Hasanah', 'email' => 'barokatun.hasanah@lecturer.itk.ac.id', 'kode' => '04', 'nip' => null],
            ['name' => 'Andhika Giyantara', 'email' => 'dhika@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '198702242019031007'],
            ['name' => 'Risty Jayanti', 'email' => 'risty.jayanti@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '100320248'],
            ['name' => 'Firilia Filiana', 'email' => 'firilia.filiana@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '199404022019032031'],
            ['name' => 'Sena Sukmananda Suprapto, M.T.', 'email' => 's.s.suprapto@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '199209122019031021'],
            ['name' => 'Mifta Nur Farid', 'email' => 'miftanurfarid@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '100118157'],
            ['name' => 'Yun Tonce Kusuma Priyanto', 'email' => 'yuntonce@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '198406162012121001'],
            ['name' => 'Muhammad Ridho Dewanto', 'email' => 'ridho.dewanto@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '100122295'],
            ['name' => 'Himawan Wicaksono', 'email' => 'himawan@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '198904012021211002'],
            ['name' => 'Riza Hadi Saputra', 'email' => 'riza.saputra@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '199201142022031009'],
            ['name' => 'Amalia Rizqi Utami', 'email' => 'amalia.rizqi@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '100320249'],
            ['name' => 'Thorikul Huda', 'email' => 'thorikul.h@lecturer.itk.ac.id', 'kode' => '04', 'nip' => '198805152018031001'],

            // Teknik Kimia (05)
            ['name' => 'Adrian Gunawan', 'email' => 'a.gunawan@lecturer.itk.ac.id', 'kode' => '05', 'nip' => null],
            ['name' => 'Azmia Rizka Nafisah', 'email' => 'azmia.rizka@lecturer.itk.ac.id', 'kode' => '05', 'nip' => null],
            ['name' => 'Mutia Reza', 'email' => 'mutia.reza@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '100321279'],
            ['name' => 'Bangkit Gotama', 'email' => 'bangkit.gotama@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '198903262020121003'],
            ['name' => 'Dian Rahmawati', 'email' => 'dian.rahmawati@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '100320258'],
            ['name' => 'Lusi Ernawati', 'email' => 'lusiernawati@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '198808192012122002'],
            ['name' => 'Rizqy Romadhona Ginting', 'email' => 'rizqy.ginting@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '199001022022031000'],
            ['name' => 'Moch Purwanto', 'email' => 'm.purwanto@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '198703072018031001'],
            ['name' => 'Jefri Pandu Hidayat', 'email' => 'jefri.pandu@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '199405132024061002'],
            ['name' => 'Nita Ariestiana Putri', 'email' => 'nita.ariestiana@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '199404092022042004'],
            ['name' => 'Riza Alviany', 'email' => 'rizaalviany@lecturer.itk.ac.id', 'kode' => '05', 'nip' => '199401042019032024'],

            // Teknik Material dan Metalurgi (06)
            ['name' => 'Jatmoko Awali', 'email' => 'jatmoko.awali@lecturer.itk.ac.id', 'kode' => '06', 'nip' => null],
            ['name' => 'Rifqi Aulia Tanjung', 'email' => 'rifqi.aulia@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199403292022031015'],
            ['name' => 'Hizkia Alpha Dewanto', 'email' => 'hizkia.ad@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '100119192'],
            ['name' => 'Gusti Umindya Nur Tajalla', 'email' => 'gusti.unt@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199302262019032020'],
            ['name' => 'Ainun Zulfikar', 'email' => 'ainun@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199403072020121002'],
            ['name' => 'Yunita Triana', 'email' => 'nita@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '198810232018032001'],
            ['name' => 'Nia Sasria', 'email' => 'niasasria@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199201152019032024'],
            ['name' => 'Muthia Putri Darsini Lubis', 'email' => 'muthia_lubis@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '198504252019032016'],
            ['name' => 'Andromeda Dwi Laksono', 'email' => 'andromeda@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199111142019031020'],
            ['name' => 'Rachmad Sulaksono Prabowo', 'email' => 'rachmad.prabowo@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199601172024061005'],
            ['name' => 'Amilita Medisa Rizky Dharmayanti, M.Si.', 'email' => 'amilita.dharmayanti@lecturer.itk.ac.id', 'kode' => '06', 'nip' => '199403082024062001'],

            // Teknik Sipil (07)
            ['name' => 'Dyah Wahyu Apriani', 'email' => 'dyahwahyuap@lecturer.itk.ac.id', 'kode' => '07', 'nip' => null],
            ['name' => 'Ardiansyah Fauzi', 'email' => 'ardiansyahfauzi@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '198804182019031009'],
            ['name' => 'Arief Nugraha Pontoh', 'email' => 'arief.nugraha@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '199006252020121002'],
            ['name' => 'Raafi Widyaputra Yulianyahya', 'email' => 'raafi.widyaputra@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '100320239'],
            ['name' => 'Basyaruddin', 'email' => 'basyaruddin@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '198806062020121003'],
            ['name' => 'Oryza Lhara Sari', 'email' => 'oryza@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '199405062022032013'],
            ['name' => 'Andina Prima Putri', 'email' => 'andina@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '198910042019032022'],
            ['name' => 'Raftonado Situmorang', 'email' => 'raftonado.situmorang@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '199302202022031009'],
            ['name' => 'Fachreza Akbar', 'email' => 'fachreza.akbar@lecturer.itk.ac.id', 'kode' => '07', 'nip' => '198811102022031005'],

            // Perencanaan Wilayah Kota (08)
            ['name' => 'Achmad Ghozali', 'email' => 'ghozali@lecturer.itk.ac.id', 'kode' => '08', 'nip' => null],
            ['name' => 'Mega Ulimaz', 'email' => 'megaulimaz@lecturer.itk.ac.id', 'kode' => '08', 'nip' => null],
            ['name' => 'Umar Mustofa', 'email' => 'umar.mustofa@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '198802032019031009'],
            ['name' => 'Maryo Inri Pratama', 'email' => 'maryo.inri@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '199603102022031012'],
            ['name' => 'Devi Triwidya Sitaresmi', 'email' => 'dsitaresmi@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '199309252019032024'],
            ['name' => 'Elin Diyah Syafitri', 'email' => 'elindiyahs@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '199111262022032011'],
            ['name' => 'Rahmat Aris Pratomo', 'email' => 'r.a.pratomo@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '198607052019031016'],
            ['name' => 'Bimo Aji Widyantoro', 'email' => 'bimo.widyantoro@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '199312012024061001'],
            ['name' => 'Khairunnisa Adhar', 'email' => 'khairunnisa.adhar@lecturer.itk.ac.id', 'kode' => '08', 'nip' => '198901242024062001'],

            // Teknik Perkapalan (09)
            ['name' => 'Taufik Hidayat', 'email' => 'taufik.hidayat@lecturer.itk.ac.id', 'kode' => '09', 'nip' => null],
            ['name' => 'Andi Mursid Nugraha Arifuddin', 'email' => 'andi.mursid@lecturer.itk.ac.id', 'kode' => '09', 'nip' => '199006052020121002'],
            ['name' => 'Samsu Dlukha Nurcholik', 'email' => 'dlukha@lecturer.itk.ac.id', 'kode' => '09', 'nip' => '198903222019031008'],
            ['name' => 'Harlian Kustiwansa', 'email' => 'harlian.kustiwansa@lecturer.itk.ac.id', 'kode' => '09', 'nip' => '199703182024061002'],

            // Sistem Informasi (10)
            ['name' => 'M. Ihsan Alfani Putera', 'email' => 'ihsanalfani@lecturer.itk.ac.id', 'kode' => '10', 'nip' => null],
            ['name' => 'M. Gilvy Langgawan Putra', 'email' => 'gilvy.langgawan@lecturer.itk.ac.id', 'kode' => '10', 'nip' => null],
            ['name' => 'I Putu Deny Arthawan Sugih Prabowo', 'email' => 'putudeny.asp@lecturer.itk.ac.id', 'kode' => '10', 'nip' => null],
            ['name' => 'Dwi Arief Prambudi', 'email' => 'dwiariefprambudi@lecturer.itk.ac.id', 'kode' => '10', 'nip' => null],
            ['name' => 'Vika Fitratunnany Insanittaqwa', 'email' => 'vika.fitra@lecturer.itk.ac.id', 'kode' => '10', 'nip' => '100320243'],
            ['name' => 'Dwi Nur Amalia, S.Kom., M.Kom', 'email' => 'amalia@lecturer.itk.ac.id', 'kode' => '10', 'nip' => '100320241'],
            ['name' => 'Yuyun Tri Wiranti', 'email' => 'yuyun@lecturer.itk.ac.id', 'kode' => '10', 'nip' => '199008092019032016'],
            ['name' => 'Henokh Lugo Hariyanto', 'email' => 'henokh.lugo@lecturer.itk.ac.id', 'kode' => '10', 'nip' => '199303062022041001'],
            ['name' => 'Arif Wicaksono Septyanto', 'email' => 'arif.wicaksono@lecturer.itk.ac.id', 'kode' => '10', 'nip' => '199209182022031009'],

            // Informatika (11)
            ['name' => 'Ariyadi', 'email' => 'ariyadi@lecturer.itk.ac.id', 'kode' => '11', 'nip' => null],
            ['name' => 'Tegar Brilian Febrianto', 'email' => 'tegar@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199009072019031014'],
            ['name' => 'Muchammad Chandra Cahyo Utomo', 'email' => 'ccahyo@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199205202019031013'],
            ['name' => 'Ramadhan Paninggalih', 'email' => 'ramadhanpaninggalih@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199502272020121006'],
            ['name' => 'Bowo Nugroho', 'email' => 'bowo.nugroho@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199008312020121002'],
            ['name' => 'Riska Kurniyanto Abdullah', 'email' => 'riska.abdullah@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '198803082020121011'],
            ['name' => 'Nur Fajri Azhar', 'email' => 'fajri@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199205182019031015'],
            ['name' => 'Syamsul Mujahidin', 'email' => 'syamsul@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199002182019031009'],
            ['name' => 'Darmansyah', 'email' => 'darmansyah@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '198704282022031002'],
            ['name' => 'Boby Mugi Pratama', 'email' => 'bmpratama@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '19940808202231007'],
            ['name' => 'Rizal Kusuma Putra', 'email' => 'rizal.putra@lecturer.itk.ac.id', 'kode' => '11', 'nip' => '199809162024061001'],

            // Teknik Industri (12)
            ['name' => 'Abdul Alimul Karim', 'email' => 'alim@lecturer.itk.ac.id', 'kode' => '12', 'nip' => null],
            ['name' => 'Sigit Rahmat Rizalmi', 'email' => 'sigit.rahmat@lecturer.itk.ac.id', 'kode' => '12', 'nip' => null],
            ['name' => 'Budiani Fitria Endrawati, S.T.P., M.T', 'email' => 'wati@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '198309052021212007'],
            ['name' => 'Muhamad Imron Zamzani', 'email' => 'imron@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '198708292019031009'],
            ['name' => 'Ahmad Jamil', 'email' => 'ahmad.jamil@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '100118152'],
            ['name' => 'Mochamad Sulaiman', 'email' => 'mochamad.sulaiman@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '198912112022031007'],
            ['name' => 'Alvin Muhammad Ainul Yaqin', 'email' => 'alvinyaqin@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '199206112020121002'],
            ['name' => 'Arini Anestesia Purba', 'email' => 'arini.anestesia@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '199209082022032010'],
            ['name' => 'Melati Salma', 'email' => 'melati.salma@lecturer.itk.ac.id', 'kode' => '12', 'nip' => '199708122025062008'],

            // Teknik Lingkungan (13)
            ['name' => 'Muhammad Ma\'arij Harfadli', 'email' => 'maarijharfadli@lecturer.itk.ac.id', 'kode' => '13', 'nip' => null],
            ['name' => 'Nia Febrianti', 'email' => 'niafebrianti@lecturer.itk.ac.id', 'kode' => '13', 'nip' => null],
            ['name' => 'Marita Wulandari', 'email' => 'maritawulandari@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '199503162019032020'],
            ['name' => 'Ismi Khairunnissa Ariani', 'email' => 'ismi.khairunnissa@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '100320263'],
            ['name' => 'Eka Masrifatus Anifah', 'email' => 'ekamasrifatus@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '198811122019032023'],
            ['name' => 'Riza Hudayarizka', 'email' => 'riza.hudayarizka@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '199309132022031008'],
            ['name' => 'Chandra Suryani Rahendaputri', 'email' => 'chandra.suryani03@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '199206102019032035'],
            ['name' => 'Cut Keumala Banaget', 'email' => 'keumala@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '199206032022032016'],
            ['name' => 'Intan Dwi Wahyu Setyo Rini', 'email' => 'intan@lecturer.itk.ac.id', 'kode' => '13', 'nip' => '199205082019032032'],

            // Teknik Kelautan (14)
            ['name' => 'Rima Gusriana Harahap', 'email' => 'rimagusrianahrp@lecturer.itk.ac.id', 'kode' => '14', 'nip' => null],
            ['name' => 'Abiyani Choirul Huda', 'email' => 'abiyani.choirul@lecturer.itk.ac.id', 'kode' => '14', 'nip' => '100320232'],
            ['name' => 'Muhammad Khaisar Wirawan, S.Kel., M.Si', 'email' => 'khaisar.wirawan@lecturer.itk.ac.id', 'kode' => '14', 'nip' => '100320233'],
            ['name' => 'Nurmawati', 'email' => 'nurmawati@lecturer.itk.ac.id', 'kode' => '14', 'nip' => '198909072019032018'],
            ['name' => 'Luh Putri Adnyani', 'email' => 'luhputria@lecturer.itk.ac.id', 'kode' => '14', 'nip' => '198909302018032001'],
            ['name' => 'Indah Melati Suci, S.T., M.T.', 'email' => 'indah.suci@lecturer.itk.ac.id', 'kode' => '14', 'nip' => '19980822025062010'],
            ['name' => 'Muhammad Abdul Ghofur Al Hakim', 'email' => 'abdul.hakim@lecturer.itk.ac.id', 'kode' => '14', 'nip' => '199312032025061003'],

            // Arsitektur (15)
            ['name' => 'Nadia Almira Jordan', 'email' => 'nadiajordan@lecturer.itk.ac.id', 'kode' => '15', 'nip' => null],
            ['name' => 'Muhammad Yogi Raditya', 'email' => 'yogi.raditya@lecturer.itk.ac.id', 'kode' => '15', 'nip' => null],
            ['name' => 'Tiara Rukmaya Dewi, S.T., M.Sc.', 'email' => 'tiararukmaya@lecturer.itk.ac.id', 'kode' => '15', 'nip' => '198901082022032011'],
            ['name' => 'Rulliannor', 'email' => 'rulliannor.syah@lecturer.itk.ac.id', 'kode' => '15', 'nip' => '199606122022031013'],
            ['name' => 'Andi Sahputra Depari', 'email' => 'andi.sahputra@lecturer.itk.ac.id', 'kode' => '15', 'nip' => '199407212022031010'],
            ['name' => 'Megan Afkasiga Ririhena', 'email' => 'megan.ririhena@lecturer.itk.ac.id', 'kode' => '15', 'nip' => '199411272024061001'],

            // Teknologi Pangan (16)
            ['name' => 'Fadhil Muhammad Tarmidzi', 'email' => 'fadhil.tarmidzi@lecturer.itk.ac.id', 'kode' => '16', 'nip' => null],
            ['name' => 'Ni\'matus Sholihah', 'email' => 'nimatus.sholihah@lecturer.itk.ac.id', 'kode' => '16', 'nip' => '100320235'],
            ['name' => 'Fadeli Muhammad Habibie', 'email' => 'fadeli.muhammad@lecturer.itk.ac.id', 'kode' => '16', 'nip' => '199104082022031007'],
            ['name' => 'Amalia Nur Kumalaningrum', 'email' => 'amalia.nur@lecturer.itk.ac.id', 'kode' => '16', 'nip' => '199206202022032015'],
            ['name' => 'Michael Alexander Hutabarat', 'email' => 'michael.hutabarat@lecturer.itk.ac.id', 'kode' => '16', 'nip' => '199106232024061003'],
            ['name' => 'Yuvita Lira Vesti Arista', 'email' => 'yuvita.arista@lecturer.itk.ac.id', 'kode' => '16', 'nip' => '199602222024062001'],
            ['name' => 'Aedesia', 'email' => 'aedesia@lecturer.itk.ac.id', 'kode' => '16', 'nip' => '133575757'],

            // Statistika (17)
            ['name' => 'Irma Fitria', 'email' => 'irma.fitria@lecturer.itk.ac.id', 'kode' => '17', 'nip' => null],
            ['name' => 'Sigit Pancahayani', 'email' => 'spancahayani@lecturer.itk.ac.id', 'kode' => '17', 'nip' => '198911242015041001'],
            ['name' => 'Diana Nurlaily', 'email' => 'diana.nurlaily@lecturer.itk.ac.id', 'kode' => '17', 'nip' => '100320216'],
            ['name' => 'Farida Nur Hayati', 'email' => 'farida.nur@lecturer.itk.ac.id', 'kode' => '17', 'nip' => '100320218'],
            ['name' => 'Surya Puspita Sari, S.Si. M.Si', 'email' => 'surya.puspita@lecturer.itk.ac.id', 'kode' => '17', 'nip' => '199306072022032016'],

            // Ilmu Aktuaria (18)
            ['name' => 'Eka Krisna Santoso', 'email' => 'eka.krisna@lecturer.itk.ac.id', 'kode' => '18', 'nip' => '100320245'],
            ['name' => 'Primadina Hasanah', 'email' => 'primadina@lecturer.itk.ac.id', 'kode' => '18', 'nip' => null],
            ['name' => 'Yustina Fitriani, M.Pd.', 'email' => 'yustina.fitriani@lecturer.itk.ac.id', 'kode' => '18', 'nip' => '100320215'],
            ['name' => 'Isti Kamila', 'email' => 'isti.kamila@lecturer.itk.ac.id', 'kode' => '18', 'nip' => null],
            ['name' => 'Wahyu Dwi Lesmono', 'email' => 'wahyu.lesmono@lecturer.itk.ac.id', 'kode' => '18', 'nip' => '199410162025061004'],

            // Bisnis Digital (19)
            ['name' => 'Bayu Nur Abdallah', 'email' => 'bayunur@lecturer.itk.ac.id', 'kode' => '19', 'nip' => null],
            ['name' => 'Widya Sartika', 'email' => 'widya.sartika@lecturer.itk.ac.id', 'kode' => '19', 'nip' => '100321286'],
            ['name' => 'Agung Prabowo', 'email' => 'agung.prabowo@lecturer.itk.ac.id', 'kode' => '19', 'nip' => '100321268'],
            ['name' => 'Luh Made Wisnu Satyaninggrat, S.Kom., M.T', 'email' => 'luh.satyaninggrat@lecturer.itk.ac.id', 'kode' => '19', 'nip' => '199309092022032009'],

            // Rekayasa Keselamatan (20)
            ['name' => 'Noni Oktiana Setiowati', 'email' => 'noni.oktiana@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '100320253'],
            ['name' => 'Anis Rohmana Malik', 'email' => 'anis.rohmana@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '199501242022032019'],
            ['name' => 'Novita Lizza Anggraini', 'email' => 'novita.anggraini@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '199411232022032012'],
            ['name' => 'Mayati Isabella', 'email' => 'mayati.isabella@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '198908262022032005'],
            ['name' => 'Tri Hardiyanti Asmaningrum', 'email' => 'tri.asmaningrum@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '199703252024062002'],
            ['name' => 'Aulia Rahma', 'email' => 'aulia.rahma@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '199506052025062004'],
            ['name' => 'Anisa Novi Andriani, S.T., M.Eng', 'email' => 'anisa.andriani@lecturer.itk.ac.id', 'kode' => '20', 'nip' => '199811112025062013'],

            // Desain Komunikasi Visual (21)
            ['name' => 'Fadli Robiandi', 'email' => 'fadlirobiandi@lecturer.itk.ac.id', 'kode' => '21', 'nip' => '198802162021211001'],
            ['name' => 'Rizka Ayu Yuniar', 'email' => 'rizka.ayu@lecturer.itk.ac.id', 'kode' => '21', 'nip' => '199406232022032020'],

            // Teknik Logistik (22)
            ['name' => 'Olivia Febrianti Ngabito', 'email' => 'olivia.ngabito@lecturer.itk.ac.id', 'kode' => '22', 'nip' => null],
            ['name' => 'Hesti Rosita Dwi Putri', 'email' => 'hesti.rosita@lecturer.itk.ac.id', 'kode' => '22', 'nip' => '199212232022032011'],
            ['name' => 'Eko Agung Syaputra', 'email' => 'eko.agung@lecturer.itk.ac.id', 'kode' => '22', 'nip' => '199612262025061008'],

            // Sains Data (23) - asumsi
            ['name' => 'Amanda Dwi Wantira', 'email' => 'amanda.dwi@lecturer.itk.ac.id', 'kode' => '23', 'nip' => '100320256'],
            ['name' => 'Hendrik Vicarlo', 'email' => 'hendrik.manihuruk@lecturer.itk.ac.id', 'kode' => '23', 'nip' => '199609122024061002'],
            ['name' => 'Tito Bisma May Willis', 'email' => 'tito.willis@lecturer.itk.ac.id', 'kode' => '23', 'nip' => '199705172024061001'],
        ];

        foreach ($dosens as $dosen) {
            $prodiName = $prodiMapping[$dosen['kode']] ?? null;
            $studyProgramId = $prodiName ? ($studyPrograms[$prodiName] ?? null) : null;

            User::firstOrCreate(
                ['email' => $dosen['email']],
                [
                    'name' => $dosen['name'],
                    'email' => $dosen['email'],
                    'password' => bcrypt('123123'),
                    'role' => 'dosen',
                    'identity_num' => $dosen['nip'],
                    'study_program_id' => $studyProgramId,
                    'institution_id' => null,
                    'is_manager' => false,
                    'is_active' => 'Active',
                ]
            );
        }
    }
}
