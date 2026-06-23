<?php

namespace App\Imports;

use App\Models\LaboratoryMaterial;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class LaboratoryMaterialImport implements ToCollection, WithHeadingRow
{
    /** @var int Jumlah baris yang berhasil ditambahkan */
    public int $imported = 0;

    /** @var array<int, array{row:int, code:mixed}> Baris yang dilewati karena kode sudah ada */
    public array $skipped = [];

    /** @var array<int, array{row:int, errors:array}> Baris yang gagal karena tidak valid */
    public array $failed = [];

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            // +2: 1 untuk baris heading, 1 karena index dimulai dari 0
            $rowNumber = $index + 2;
            $data = $row->toArray();

            // Lewati baris yang benar-benar kosong
            if (collect($data)->filter(fn ($v) => $v !== null && $v !== '')->isEmpty()) {
                continue;
            }

            $get = fn ($key) => (isset($data[$key]) && $data[$key] !== '') ? $data[$key] : null;

            $validator = Validator::make($data, [
                'code' => 'required',
                'material_name' => 'required',
                'stock' => 'required|integer|min:0',
                'unit' => 'required',
                'purchase_date' => 'required',
                'refill_date' => 'required',
                'expiry_date' => 'nullable',
                'student_price' => 'nullable|integer|min:0',
                'lecturer_price' => 'nullable|integer|min:0',
                'external_price' => 'nullable|integer|min:0',
            ], [
                'code.required' => 'Kolom code wajib diisi.',
                'material_name.required' => 'Kolom material_name wajib diisi.',
                'stock.required' => 'Kolom stock wajib diisi.',
                'stock.integer' => 'Kolom stock harus berupa angka.',
                'unit.required' => 'Kolom unit wajib diisi.',
                'purchase_date.required' => 'Kolom purchase_date wajib diisi.',
                'refill_date.required' => 'Kolom refill_date wajib diisi.',
            ]);

            // Validasi tanggal dilakukan manual karena nilai dari Excel bisa berupa serial number
            $purchaseDate = $this->parseDate($get('purchase_date'));
            $refillDate = $this->parseDate($get('refill_date'));
            $expiryDate = $get('expiry_date') !== null ? $this->parseDate($get('expiry_date')) : null;

            if ($get('purchase_date') !== null && $purchaseDate === null) {
                $validator->after(fn ($v) => $v->errors()->add('purchase_date', 'Format purchase_date tidak valid (gunakan YYYY-MM-DD).'));
            }
            if ($get('refill_date') !== null && $refillDate === null) {
                $validator->after(fn ($v) => $v->errors()->add('refill_date', 'Format refill_date tidak valid (gunakan YYYY-MM-DD).'));
            }
            if ($get('expiry_date') !== null && $expiryDate === null) {
                $validator->after(fn ($v) => $v->errors()->add('expiry_date', 'Format expiry_date tidak valid (gunakan YYYY-MM-DD).'));
            }

            if ($validator->fails()) {
                $this->failed[] = ['row' => $rowNumber, 'errors' => $validator->errors()->all()];
                continue;
            }

            // Lewati jika kode sudah ada di database
            if (LaboratoryMaterial::where('code', $get('code'))->exists()) {
                $this->skipped[] = ['row' => $rowNumber, 'code' => $get('code')];
                continue;
            }

            LaboratoryMaterial::create([
                'code' => $get('code'),
                'material_name' => $get('material_name'),
                'brand' => $get('brand'),
                'stock' => (int) $get('stock'),
                'unit' => $get('unit'),
                'purchase_date' => $purchaseDate,
                'expiry_date' => $expiryDate,
                'description' => $get('description'),
                'refill_date' => $refillDate,
                'student_price' => (int) ($get('student_price') ?? 0),
                'lecturer_price' => (int) ($get('lecturer_price') ?? 0),
                'external_price' => (int) ($get('external_price') ?? 0),
            ]);

            $this->imported++;
        }
    }

    /**
     * Konversi nilai tanggal dari Excel (serial number atau string) menjadi Y-m-d.
     */
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
            'skipped' => $this->skipped,
            'failed' => $this->failed,
        ];
    }
}
