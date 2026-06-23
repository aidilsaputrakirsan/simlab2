<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LaboratoryMaterialTemplateExport implements FromArray, WithHeadings
{
    public function headings(): array
    {
        return [
            'code',
            'material_name',
            'brand',
            'stock',
            'unit',
            'purchase_date',
            'expiry_date',
            'description',
            'refill_date',
            'student_price',
            'lecturer_price',
            'external_price',
        ];
    }

    public function array(): array
    {
        // Baris contoh agar pengguna tahu format pengisian
        return [
            [
                'BHN-001',
                'Natrium Klorida',
                'Merck',
                100,
                'gram',
                '2025-01-15',
                '2027-01-15',
                'Contoh keterangan bahan',
                '2025-01-15',
                0,
                0,
                0,
            ],
        ];
    }
}
