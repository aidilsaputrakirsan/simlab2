<table border="1">
    <thead>
        <tr>
            <th>Tahun Akademik</th>
            <th>Pemohon</th>
            <th>Tujuan</th>
            <th>Dosen Pembimbing</th>
            <th>Tanggal Pelaksanaan</th>
            <th>Waktu Pelaksanaan</th>
            <th>Jenis Peminjaman</th>
            <th>Ruangan yang Digunakan</th>
            <th>Alat yang Digunakan</th>
            <th>Bahan yang Digunakan</th>
            <th>Verifikasi Kalab</th>
            <th>Verifikasi Laboran</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($booking as $booking)
            <tr>
                <td>{{ $booking->academicYear->name }}</td>
                <td>
                    <b>{{ $booking->user->name }}</b> <br>
                    @if ($booking->user->role == 'pihak_luar')
                        Institusi: {{ $booking->user->institution->name }}
                    @else
                        Prodi: {{ $booking->user->studyProgram->name }}
                    @endif
                </td>
                <td>
                    <b>{{ $booking->purpose }}</b> <br>
                    Judul: {{ $booking->activity_name }}
                </td>
                <td>
                    <b>{{ $booking->supervisor ?? '-' }}</b> <br>
                    Email: {{ $booking->supervisor_email ?? '-' }}
                </td>

                <td>{{ $booking->start_time->format('Y-m-d') }} s/d {{ $booking->end_time->format('Y-m-d') }}</td>
                <td>{{ $booking->start_time->format('H:i') }} s/d {{ $booking->end_time->format('H:i') }} WITA</td>
                <td>{{ $booking->booking_type_formatted }}</td>
                <td>{{ $booking->laboratoryRoom->name ?? '-' }}</td>
                <td>
                    @forelse ($booking->equipments as $equipment)
                        - {{ $equipment->laboratoryEquipment->equipment_name }} | {{ $equipment->quantity }} <br>
                    @empty
                        -
                    @endforelse
                </td>
                <td>
                    @forelse ($booking->materials as $material)
                        - {{ $material->laboratoryMaterial->material_name }} | {{ $material->quantity }} {{ $material->laboratoryMaterial->unit }} <br>
                    @empty
                        -
                    @endforelse
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
