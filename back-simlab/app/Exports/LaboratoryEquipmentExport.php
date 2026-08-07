<?php

namespace App\Exports;

use App\Models\LaboratoryEquipment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export master alat laboratorium.
 * Daftar id ruangan kosong berarti seluruh laboratorium ikut diexport.
 */
class LaboratoryEquipmentExport implements FromCollection, WithHeadings, WithColumnWidths, WithStyles
{
    /** @param int[] $laboratoryRoomIds */
    public function __construct(private array $laboratoryRoomIds = []) {}

    public function collection()
    {
        $query = LaboratoryEquipment::with('laboratoryRoom');

        if (!empty($this->laboratoryRoomIds)) {
            $query->whereIn('laboratory_room_id', $this->laboratoryRoomIds);
        }

        $no = 0;

        return $query->orderBy('laboratory_room_id')
            ->orderBy('equipment_name')
            ->get()
            ->map(function ($equipment) use (&$no) {
                return [
                    'no' => ++$no,
                    'laboratorium' => $equipment->laboratoryRoom?->name ?? '-',
                    'kode_asset' => $equipment->asset_code ?: '-',
                    'nama_alat' => $equipment->equipment_name,
                    'merek' => $equipment->brand ?: '-',
                    'jenis_alat' => $equipment->equipment_type ?: '-',
                    'jumlah' => $equipment->quantity,
                    'satuan' => $equipment->unit,
                    'asal_alat' => $equipment->origin ?: '-',
                    'kondisi' => $equipment->condition ?: '-',
                    'keterangan_kondisi' => $equipment->condition_description ?: '-',
                    'fungsi' => $equipment->function ?: '-',
                    'harga_mahasiswa' => $equipment->student_price ?? 0,
                    'harga_dosen' => $equipment->lecturer_price ?? 0,
                    'harga_external' => $equipment->external_price ?? 0,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'No',
            'Laboratorium',
            'Kode Asset',
            'Nama Alat',
            'Merek',
            'Jenis Alat',
            'Jumlah',
            'Satuan',
            'Asal Alat',
            'Kondisi',
            'Keterangan Kondisi',
            'Fungsi',
            'Harga Mahasiswa',
            'Harga Dosen',
            'Harga External',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 28,
            'C' => 20,
            'D' => 34,
            'E' => 18,
            'F' => 20,
            'G' => 10,
            'H' => 10,
            'I' => 18,
            'J' => 14,
            'K' => 30,
            'L' => 34,
            'M' => 18,
            'N' => 16,
            'O' => 16,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'O';
        $lastRow = $sheet->getHighestRow();

        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1F4E78'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->freezePane('A2');

        if ($lastRow > 1) {
            // Harga tampil sebagai rupiah, kolom teks panjang dibuat wrap
            $sheet->getStyle("M2:O{$lastRow}")
                ->getNumberFormat()
                ->setFormatCode('"Rp"#,##0');
            $sheet->getStyle("K2:L{$lastRow}")
                ->getAlignment()
                ->setWrapText(true);
        }

        return [];
    }
}
