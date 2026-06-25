<?php

namespace App\Imports;

use App\Exports\LaboratoryMaterialTemplateExport;
use App\Models\LaboratoryMaterial;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class LaboratoryMaterialImport implements ToCollection, WithMultipleSheets
{
    /** Jumlah baris header pada template (judul, nama kolom, petunjuk, catatan) */
    private const HEADER_ROWS = 4;

    /** Pemetaan posisi kolom (0-indeks) template -> field sistem */
    private const COLS = [
        'code'           => 0,  // Kode Asset *
        'material_name'  => 1,  // Nama Bahan *
        'brand'          => 2,  // Merek
        'stock'          => 3,  // Jumlah Bahan *
        'unit'           => 4,  // Satuan *
        'purchase_date'  => 5,  // Tanggal Pembelian
        'expiry_date'    => 6,  // Tanggal Kadaluarsa
        'refill_date'    => 7,  // Tanggal Restock Terakhir
        'student_price'  => 8,  // Harga Mahasiswa
        'lecturer_price' => 9,  // Harga Dosen
        'external_price' => 10, // Harga External
        'description'    => 11, // Keterangan
    ];

    /** Satuan yang diterima (sesuai spesifikasi template) */
    private const UNITS = ['mL', 'L', 'gram', 'mg', 'kg', 'Pcs', 'Botol', 'Ampul', 'Set', 'Pak', 'Galon', 'Rol'];

    /** Jumlah baris yang ditambahkan (kode baru) */
    public int $imported = 0;

    /** Jumlah baris yang diperbarui (kode sudah ada / upsert) */
    public int $updated = 0;

    /** @var array<int, array{row:int, errors:array}> */
    public array $failed = [];

    /** Hanya proses sheet pertama (data); sheet ke-2 adalah lembar spesifikasi. */
    public function sheets(): array
    {
        return [0 => $this];
    }

    public function collection(Collection $rows)
    {
        // Validasi struktur: pastikan file memakai template yang benar
        if (!$this->headerMatches($rows)) {
            $this->failed[] = [
                'row' => 2,
                'errors' => ['Format file tidak sesuai template. Pastikan memakai "Template Import Bahan Laboratorium" tanpa mengubah nama/urutan kolom. Silakan unduh ulang via tombol "Download Template".'],
            ];
            return;
        }

        foreach ($rows as $index => $row) {
            // Lewati baris header tetap (judul, nama kolom, petunjuk, catatan)
            if ($index < self::HEADER_ROWS) {
                continue;
            }

            $cells = $row->values()->toArray();

            // Lewati baris yang benar-benar kosong
            if (collect($cells)->filter(fn ($v) => $v !== null && $v !== '')->isEmpty()) {
                continue;
            }

            $get = fn (string $key) => $this->cell($cells, self::COLS[$key]);

            $rowNumber = $index + 1; // nomor baris pada Excel (1-indeks)

            $data = [
                'code'          => $get('code'),
                'material_name' => $get('material_name'),
                'stock'         => $get('stock'),
                'unit'          => $get('unit'),
            ];

            $validator = Validator::make($data, [
                'code'          => 'required',
                'material_name' => 'required',
                'stock'         => 'required|numeric|gt:0',
                'unit'          => 'required',
            ], [
                'code.required'          => 'Kolom Kode Asset wajib diisi.',
                'material_name.required' => 'Kolom Nama Bahan wajib diisi.',
                'stock.required'         => 'Kolom Jumlah Bahan wajib diisi.',
                'stock.numeric'          => 'Kolom Jumlah Bahan harus berupa angka.',
                'stock.gt'               => 'Kolom Jumlah Bahan harus lebih dari 0.',
                'unit.required'          => 'Kolom Satuan wajib diisi.',
            ]);

            // Normalisasi & validasi Satuan terhadap daftar yang diterima
            $unit = $this->normalizeUnit($get('unit'));
            if ($get('unit') !== null && $unit === null) {
                $validator->after(fn ($v) => $v->errors()->add(
                    'unit',
                    'Satuan tidak valid. Pilih salah satu: ' . implode(', ', self::UNITS) . '.'
                ));
            }

            // Validasi harga (opsional, default 0) jika diisi
            foreach (['student_price' => 'Harga Mahasiswa', 'lecturer_price' => 'Harga Dosen', 'external_price' => 'Harga External'] as $key => $label) {
                $val = $get($key);
                if ($val !== null && !is_numeric($val)) {
                    $validator->after(fn ($v) => $v->errors()->add($key, "Kolom {$label} harus berupa angka."));
                }
            }

            // Parsing tanggal (nullable). Bila diisi tapi format salah -> error.
            $purchaseDate = $this->parseDate($get('purchase_date'));
            $expiryDate   = $this->parseDate($get('expiry_date'));
            $refillDate   = $this->parseDate($get('refill_date'));

            if ($get('purchase_date') !== null && $purchaseDate === null) {
                $validator->after(fn ($v) => $v->errors()->add('purchase_date', 'Format Tanggal Pembelian tidak valid (gunakan YYYY-MM-DD).'));
            }
            if ($get('expiry_date') !== null && $expiryDate === null) {
                $validator->after(fn ($v) => $v->errors()->add('expiry_date', 'Format Tanggal Kadaluarsa tidak valid (gunakan YYYY-MM-DD).'));
            }
            if ($get('refill_date') !== null && $refillDate === null) {
                $validator->after(fn ($v) => $v->errors()->add('refill_date', 'Format Tanggal Restock Terakhir tidak valid (gunakan YYYY-MM-DD).'));
            }

            if ($validator->fails()) {
                $this->failed[] = ['row' => $rowNumber, 'errors' => $validator->errors()->all()];
                continue;
            }

            // Upsert berdasarkan Kode Asset: perbarui bila kode sudah ada, insert bila baru
            $material = LaboratoryMaterial::updateOrCreate(
                ['code' => $get('code')],
                [
                    'material_name'  => $get('material_name'),
                    'brand'          => $get('brand'),
                    'stock'          => (int) $get('stock'),
                    'unit'           => $unit,
                    'purchase_date'  => $purchaseDate,
                    'expiry_date'    => $expiryDate,
                    'description'    => $get('description'),
                    'refill_date'    => $refillDate,
                    'student_price'  => (int) ($get('student_price') ?? 0),
                    'lecturer_price' => (int) ($get('lecturer_price') ?? 0),
                    'external_price' => (int) ($get('external_price') ?? 0),
                ]
            );

            if ($material->wasRecentlyCreated) {
                $this->imported++;
            } else {
                $this->updated++;
            }
        }
    }

    /** Pastikan baris header (baris ke-2) cocok dengan template resmi. */
    private function headerMatches(Collection $rows): bool
    {
        $headerRow = $rows->get(1); // index 1 = baris ke-2 Excel
        if (!$headerRow) {
            return false;
        }

        $cells = $headerRow->values()->toArray();
        $expected = LaboratoryMaterialTemplateExport::HEADERS;

        // Cek 5 kolom inti (Kode Asset, Nama Bahan, Merek, Jumlah Bahan, Satuan)
        foreach ([0, 1, 2, 3, 4] as $i) {
            if ($this->normalizeHeader($cells[$i] ?? null) !== $this->normalizeHeader($expected[$i])) {
                return false;
            }
        }

        return true;
    }

    /** Normalkan label header: buang tanda '*', spasi, dan kapitalisasi. */
    private function normalizeHeader($value): string
    {
        $s = is_string($value) ? $value : (string) ($value ?? '');
        return strtolower(trim(str_replace('*', '', $s)));
    }

    /** Ambil nilai sel berdasarkan posisi; string kosong dianggap null. */
    private function cell(array $cells, int $pos)
    {
        $val = $cells[$pos] ?? null;
        if (is_string($val)) {
            $val = trim($val);
        }
        return ($val === null || $val === '') ? null : $val;
    }

    /** Normalkan satuan ke kapitalisasi kanonik; null jika di luar daftar. */
    private function normalizeUnit($unit): ?string
    {
        if ($unit === null || $unit === '') {
            return null;
        }

        $u = trim((string) $unit);
        foreach (self::UNITS as $canonical) {
            if (strcasecmp($u, $canonical) === 0) {
                return $canonical;
            }
        }

        return null;
    }

    /** Konversi nilai tanggal (serial Excel atau string) menjadi Y-m-d, atau null. */
    private function parseDate($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(ExcelDate::excelToDateTimeObject($value))->format('Y-m-d');
            }

            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function getSummary(): array
    {
        return [
            'imported' => $this->imported,
            'updated'  => $this->updated,
            'failed'   => $this->failed,
        ];
    }
}
