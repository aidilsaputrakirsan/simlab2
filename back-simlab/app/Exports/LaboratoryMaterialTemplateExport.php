<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

/**
 * Template import bahan laboratorium yang dihasilkan oleh sistem.
 * Struktur SHEET 0 harus konsisten dengan LaboratoryMaterialImport
 * (4 baris header: judul, nama kolom, petunjuk, catatan; data mulai baris 5).
 */
class LaboratoryMaterialTemplateExport implements WithMultipleSheets
{
    /** Satuan yang diterima — harus sama dengan importer */
    public const UNITS = ['mL', 'L', 'gram', 'mg', 'kg', 'Pcs', 'Botol', 'Ampul', 'Set', 'Pak', 'Galon', 'Rol'];

    /** Label kolom (baris 2) — dipakai juga importer untuk validasi header */
    public const HEADERS = [
        'Kode Asset *',
        'Nama Bahan *',
        'Merek',
        'Jumlah Bahan *',
        'Satuan *',
        'Tanggal Pembelian',
        'Tanggal Kadaluarsa',
        'Tanggal Restock Terakhir',
        'Harga Mahasiswa',
        'Harga Dosen',
        'Harga External',
        'Keterangan',
    ];

    public function sheets(): array
    {
        return [
            new LaboratoryMaterialTemplateDataSheet(),
            new LaboratoryMaterialTemplateSpecSheet(),
        ];
    }
}

class LaboratoryMaterialTemplateDataSheet implements FromArray, WithTitle, WithEvents, WithColumnWidths
{
    public function title(): string
    {
        return 'Data Bahan';
    }

    public function array(): array
    {
        return [
            ['TEMPLATE IMPORT BAHAN LABORATORIUM — SIGMA (Sistem Informasi Gudang, Manajemen dan Analitik)   |   UPA Laboratorium Terpadu ITK'],
            LaboratoryMaterialTemplateExport::HEADERS,
            ['Text (mis. 1.TKP.BC.00)', 'Text (nama + rumus)', 'Text (mis. Merck)', 'Number (> 0)', 'Dropdown', 'Date (YYYY-MM-DD)', 'Date (YYYY-MM-DD)', 'Date (YYYY-MM-DD)', 'Number (Rp, angka saja)', 'Number (Rp, angka saja)', 'Number (Rp, angka saja)', 'Text (mis. Ready)'],
            ['* = Wajib diisi    |    Tanggal format YYYY-MM-DD    |    Harga: angka saja tanpa "Rp", titik, atau koma (contoh: 150000)    |    Baris contoh (kuning) hapus sebelum import'],
            ['1.TKP.BC.00', '2-Propanol (C3H8O)', 'Merck', 1000, 'mL', '2015-01-01', '2022-03-21', '2022-03-21', 0, 0, 0, 'Ready'],
            ['A1.ENG.BC.01-24', 'Aluminium Standar Solution 1000 mg/l', null, 500, 'mL', null, '2026-05-31', '2024-09-24', 0, 0, 0, 'Ready'],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 20, 'B' => 34, 'C' => 16, 'D' => 14, 'E' => 10, 'F' => 16, 'G' => 16, 'H' => 22, 'I' => 16, 'J' => 14, 'K' => 14, 'L' => 16];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Judul (baris 1)
                $sheet->mergeCells('A1:L1');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
                $sheet->getStyle('A1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('DCE6F1');
                $sheet->getRowDimension(1)->setRowHeight(26);

                // Nama kolom (baris 2)
                $sheet->getStyle('A2:L2')->getFont()->setBold(true);
                $sheet->getStyle('A2:L2')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('B7DEE8');

                // Petunjuk (baris 3)
                $sheet->getStyle('A3:L3')->getFont()->setItalic(true)->setSize(9);

                // Catatan (baris 4)
                $sheet->mergeCells('A4:L4');
                $sheet->getStyle('A4')->getFont()->setItalic(true)->setSize(9);
                $sheet->getStyle('A4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('FCE4D6');

                // Baris contoh (5-6) kuning
                $sheet->getStyle('A5:L6')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('FFF2CC');

                // Border area header + contoh
                $sheet->getStyle('A2:L6')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

                // Dropdown Satuan (kolom E) untuk baris data
                $list = '"' . implode(',', LaboratoryMaterialTemplateExport::UNITS) . '"';
                for ($row = 5; $row <= 200; $row++) {
                    $dv = $sheet->getCell('E' . $row)->getDataValidation();
                    $dv->setType(DataValidation::TYPE_LIST)
                        ->setAllowBlank(true)
                        ->setShowDropDown(true)
                        ->setShowErrorMessage(true)
                        ->setErrorStyle(DataValidation::STYLE_STOP)
                        ->setErrorTitle('Satuan tidak valid')
                        ->setError('Pilih satuan dari daftar yang tersedia.')
                        ->setFormula1($list);
                }
            },
        ];
    }
}

class LaboratoryMaterialTemplateSpecSheet implements FromArray, WithTitle, WithEvents, WithColumnWidths
{
    public function title(): string
    {
        return 'Spesifikasi';
    }

    public function array(): array
    {
        return [
            ['No', 'Nama Kolom', 'Tipe Data', 'Wajib?', 'Diisi Sistem?', 'Aturan Validasi / Catatan'],
            [1, 'Kode Asset', 'VARCHAR', 'Ya', 'Tidak', 'Identifier unik per bahan. Saat import: UPSERT by Kode Asset (perbarui bila sudah ada, insert bila baru). Format bebas, mis. 1.TKP.BC.00.'],
            [2, 'Nama Bahan', 'VARCHAR', 'Ya', 'Tidak', 'Nama bahan + rumus kimia.'],
            [3, 'Merek', 'VARCHAR', 'Tidak', 'Tidak', 'Nullable. Kosongkan bila tidak ada merek.'],
            [4, 'Jumlah Bahan', 'INTEGER > 0', 'Ya', 'Tidak', 'Angka lebih dari 0. Disimpan terpisah dari Satuan. Tolak 0 atau negatif.'],
            [5, 'Satuan', 'ENUM', 'Ya', 'Tidak', 'Nilai diterima: ' . implode(', ', LaboratoryMaterialTemplateExport::UNITS) . '. Kapitalisasi dinormalkan (mL bukan ml).'],
            [6, 'Tanggal Pembelian', 'DATE (YYYY-MM-DD)', 'Tidak', 'Tidak', 'Nullable. Validasi tanggal valid bila diisi.'],
            [7, 'Tanggal Kadaluarsa', 'DATE (YYYY-MM-DD)', 'Tidak', 'Tidak', 'Nullable.'],
            [8, 'Tanggal Restock Terakhir', 'DATE (YYYY-MM-DD)', 'Tidak', 'Tidak', 'Nullable.'],
            [9, 'Harga Mahasiswa', 'BIGINT (Rp)', 'Tidak', 'Tidak', 'Default 0. Angka saja tanpa pemisah ribuan.'],
            [10, 'Harga Dosen', 'BIGINT (Rp)', 'Tidak', 'Tidak', 'Default 0. Angka saja.'],
            [11, 'Harga External', 'BIGINT (Rp)', 'Tidak', 'Tidak', 'Default 0. Angka saja.'],
            [12, 'Keterangan', 'VARCHAR', 'Tidak', 'Tidak', 'Status/catatan bebas. Mis. Ready.'],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 5, 'B' => 24, 'C' => 18, 'D' => 8, 'E' => 14, 'F' => 80];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $sheet->getStyle('A1:F1')->getFont()->setBold(true);
                $sheet->getStyle('A1:F1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('B7DEE8');
                $sheet->getStyle('A1:F13')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
                $sheet->getStyle('A1:F13')->getAlignment()->setVertical(Alignment::VERTICAL_TOP)->setWrapText(true);
            },
        ];
    }
}
