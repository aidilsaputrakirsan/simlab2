<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Surat Pemberitahuan Peminjaman Alat</title>
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { font-size: 11px; color: #000; margin: 0; }
        .kop { width: 100%; border-bottom: 3px solid #000; padding-bottom: 8px; margin-bottom: 4px; }
        .kop table { width: 100%; border-collapse: collapse; }
        .kop td { vertical-align: middle; border: none; }
        .kop .logo-cell { width: 90px; text-align: center; }
        .kop .text-cell { text-align: center; }
        .kop .text-cell .line1 { font-size: 13px; font-weight: bold; }
        .kop .text-cell .line2 { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
        .kop .text-cell .line3 { font-size: 10px; }
        .title { text-align: center; font-size: 14px; font-weight: bold; margin: 14px 0; text-decoration: underline; }
        table.data { width: 100%; border-collapse: collapse; }
        table.data td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
        td.label { width: 38%; }
        td.sep { width: 2%; text-align: center; }
        .center-bold { text-align: center; font-weight: bold; }
        ol { margin: 4px 0 4px 16px; padding: 0; }
        ol li { margin-bottom: 4px; }
        .sign-area { padding: 6px; height: 120px; }
        .footer-sign { margin-top: 24px; text-align: right; }
        .footer-left { margin-top: 6px; }
    </style>
</head>

<body>
    <div class="kop">
        <table>
            <tr>
                <td class="logo-cell">
                    @if ($logo)
                        <img src="{{ $logo }}" width="72" alt="Logo ITK">
                    @endif
                </td>
                <td class="text-cell">
                    <div class="line1">INSTITUT TEKNOLOGI KALIMANTAN</div>
                    <div class="line2">LABORATORIUM TERPADU</div>
                    <div class="line3">Jl. Soekarno Hatta No. KM 15, Karang Joang, Kec. Balikpapan Utara,<br>Kota Balikpapan, Kalimantan Timur 76127</div>
                </td>
                <td class="logo-cell"></td>
            </tr>
        </table>
    </div>

    <div class="title">
        SURAT PEMBERITAHUAN PEMINJAMAN ALAT DI LABORATORIUM TERPADU ITK
    </div>

    <table class="data">
        <tr><td class="label">Tahun Akademik</td><td class="sep">:</td><td>{{ $academicYear }}</td></tr>
        <tr><td class="label">Nama</td><td class="sep">:</td><td>{{ $name }}</td></tr>
        <tr><td class="label">Identitas Pengguna</td><td class="sep">:</td><td>{{ $identity }}</td></tr>
        <tr><td class="label">Program Studi / Instansi</td><td class="sep">:</td><td>{{ $studyProgram }}</td></tr>
        <tr><td class="label">Telepon</td><td class="sep">:</td><td>{{ $phone }}</td></tr>
        <tr><td class="label">Tujuan Penggunaan</td><td class="sep">:</td><td>{{ $purpose }}</td></tr>
        <tr><td class="label">Judul Proyek / Penelitian:</td><td class="sep">:</td><td>{{ $activityName }}</td></tr>
        <tr><td class="label">Dosen Pembimbing</td><td class="sep">:</td><td>{{ $supervisor }}</td></tr>
        <tr><td class="label">Email Dosen Pembimbing</td><td class="sep">:</td><td>{{ $supervisorEmail }}</td></tr>
        <tr><td class="label">Jumlah Orang:</td><td class="sep">:</td><td>{{ $totalParticipant }}</td></tr>
        <tr><td class="label">Nama - Nama Yang Akan Menggunakan Alat(Jika lebih dari 1 orang):</td><td class="sep">:</td><td>{{ $participantList }}</td></tr>
        <tr><td class="label">Tanggal Penggunaan</td><td class="sep">:</td><td>{{ $dateRange }}</td></tr>
        <tr><td class="label">Waktu Penggunaan</td><td class="sep">:</td><td>{{ $timeRange }}</td></tr>
        <tr><td class="label">Daftar Alat Yang Dibutuhkan</td><td class="sep">:</td><td>{{ $equipmentList }}</td></tr>
        <tr><td class="label">Ruangan Penggunaan Alat:</td><td class="sep">:</td><td>{{ $room }}</td></tr>
        <tr><td class="label">Penggunaan Alat Diluar Laboratorium</td><td class="sep">:</td><td>{{ $offsite }}</td></tr>
        <tr><td class="label">Catatan</td><td class="sep">:</td><td>{{ $catatan }}</td></tr>
        <tr><td colspan="3" class="center-bold">DIIJINKAN</td></tr>
        <tr>
            <td colspan="2" class="sign-area">
                Yang bertanda tangan,
                <div class="footer-left">
                    <br><br><br>
                    {{ $name }}<br>{{ $identity }}
                </div>
            </td>
            <td class="sign-area">
                <strong>Pernyataan Peminjam :</strong>
                <ol>
                    <li>Bertanggungjawab terhadap fasilitas laboratorium digunakan.</li>
                    <li>Bersedia mengganti fasilitas yang rusak dalam masa peminjaman.</li>
                    <li>Bersedia meninggalkan kartu identitas sebagai jaminan selama peminjam kepada Penanggungjawab Ruang.</li>
                    <li>Selalu membawa Surat Pemberitahuan ini saat pelaksanaan penelitian.</li>
                    <li>Sebelum menggunakan harap menghubungi Penanggungjawab Ruang</li>
                </ol>
            </td>
        </tr>
    </table>

    <div class="footer-sign">
        Balikpapan, ........................................<br>
        Penanggung Jawab Ruangan/Laboran
        <div style="height: 80px;"></div>
        {{ $laboran }}
    </div>
</body>

</html>
