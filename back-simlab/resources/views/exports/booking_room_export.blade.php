<table>
    <thead>
        <tr>
            <th>Tahun Akademik</th>
            <th>Pemohon</th>
            <th>Tujuan</th>
            <th>Dosen Pembimbing</th>
            <th>Ruangan</th>
            <th>Tanggal Pelaksanaan</th>
            <th>Waktu Pelaksanaan</th>
            <th>Approval</th>
        </tr>
    </thead>
                </td>
        @foreach ($booking as $booking)
            <tr>
                <td>{{ $booking->academicYear->name ?? '-' }}</td>
                <td>
                    <b>{{ $booking->user->name ?? '-' }}</b> <br>
                    @if (($booking->user->role ?? '') == 'pihak_luar')
                        Institusi: {{ $booking->user->institution->name ?? '-' }}
                    @else
                <td>
                    @if (is_array($booking->approval_steps) && count($booking->approval_steps) > 0)
                        <ul>
                            @foreach ($booking->approval_steps as $step)
                                <li>
                                    ({{ $step['role'] }}) {{ $step['description'] }}:
                                    <b>{{ $step['status'] }}</b>
                                    @if (!empty($step['approver'])) oleh {{ $step['approver'] }} @endif
                                    @if (!empty($step['approved_at'])) ({{ $step['approved_at'] }}) @endif
                                    @if (!empty($step['information'])) - Catatan: {{ $step['information'] }} @endif
                                </li>
                            @endforeach
                        </ul>
                    @else
                        -
                    @endif
                </td>
                        Prodi: {{ $booking->user->studyProgram->name ?? '-' }}
                    @endif
                </td>
                <td>
                    <b>{{ $booking->purpose ?? '-' }}</b> <br>
                    Judul: {{ $booking->activity_name ?? '-' }}
                </td>
                @if (($booking->user->role ?? '') === 'mahasiswa')
                    <td>
                        <b>{{ $booking->supervisor ?? '-' }}</b> <br>
                        {{ $booking->supervisor_email ?? '-' }}
                    </td>
                @else
                    <td>-</td>
                @endif
                <td>{{ $booking->laboratoryRoom->name ?? '-' }}</td>
                <td>{{ $booking->start_time ? \Carbon\Carbon::parse($booking->start_time)->format('Y-m-d') : '-' }}</td>
                <td>
                    @php
                        $start = $booking->start_time ? \Carbon\Carbon::parse($booking->start_time)->format('H:i') : null;
                        $end = $booking->end_time ? \Carbon\Carbon::parse($booking->end_time)->format('H:i') : null;
                    @endphp
                    {{ $start && $end ? $start . ' s/d ' . $end : '-' }}
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
