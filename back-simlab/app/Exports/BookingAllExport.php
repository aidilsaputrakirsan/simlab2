<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class BookingAllExport implements FromCollection, WithHeadings, WithColumnWidths
{
    public function collection()
    {
        return Booking::with([
            'academicYear',
            'user.studyProgram',
            'user.institution',
            'laboratoryRoom',
            'laboran',
            'equipments.laboratoryEquipment',
            'materials.laboratoryMaterial',
            'approvals.approver'
        ])
            ->get()
            ->map(function ($booking) {
                // Combine all resources
                $resources = [];
                if ($booking->laboratoryRoom) {
                    $resources[] = "Ruangan: {$booking->laboratoryRoom->name}";
                }
                if ($booking->equipments && count($booking->equipments) > 0) {
                    $equipments = $booking->equipments
                        ->map(fn($eq) => $eq->laboratoryEquipment?->name ?? '-')
                        ->implode(', ');
                    $resources[] = "Alat: {$equipments}";
                }
                if ($booking->materials && count($booking->materials) > 0) {
                    $materials = $booking->materials
                        ->map(fn($mat) => ($mat->laboratoryMaterial?->name ?? '-') . " ({$mat->quantity})")
                        ->implode(', ');
                    $resources[] = "Bahan: {$materials}";
                }

                $approvalText = '';
                if ($booking->approvals && count($booking->approvals) > 0) {
                    $approvalText = implode("\n", $booking->approvals->map(function ($approval) {
                        $text = "({$approval->role}) {$approval->description}: {$approval->status}";
                        if ($approval->approver) {
                            $text .= " oleh {$approval->approver->name}";
                        }
                        if ($approval->approved_at) {
                            $text .= " ({$approval->approved_at})";
                        }
                        if ($approval->information) {
                            $text .= " - Catatan: {$approval->information}";
                        }
                        return $text;
                    })->toArray());
                }

                return [
                    'id' => $booking->id,
                    'tanggal_peminjaman' => $booking->booking_date,
                    'tanggal_pengembalian' => $booking->return_date,
                    'peminjam' => $booking->user?->name ?? '-',
                    'institusi' => $booking->user?->institution?->name ?? '-',
                    'prodi' => $booking->user?->studyProgram?->name ?? '-',
                    'keperluan' => $booking->purpose,
                    'nama_kegiatan' => $booking->activity_name,
                    'sumber_daya' => implode("\n", $resources) ?: '-',
                    'laboran' => $booking->laboran?->name ?? '-',
                    'status' => $booking->status,
                    'tipe_peminjaman' => $booking->booking_type,
                    'approval_steps' => $approvalText ?: '-',
                    'tahun_akademik' => $booking->academicYear?->year ?? '-',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Tanggal Peminjaman',
            'Tanggal Pengembalian',
            'Peminjam',
            'Institusi',
            'Prodi',
            'Keperluan',
            'Nama Kegiatan',
            'Sumber Daya',
            'Laboran',
            'Status',
            'Tipe Peminjaman',
            'Approval Steps',
            'Tahun Akademik',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 10,
            'B' => 15,
            'C' => 15,
            'D' => 20,
            'E' => 20,
            'F' => 15,
            'G' => 20,
            'H' => 20,
            'I' => 30,
            'J' => 15,
            'K' => 10,
            'L' => 15,
            'M' => 40,
            'N' => 15,
        ];
    }
}
