<?php

namespace App\Http\Requests;

class LaboratoryEquipmentRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'ruangan_laboratorium_id' => 'required|exists:ruangan_laboratoria,id',
            'equipment_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|max:50',
            'function' => 'nullable|string',
            'brand' => 'required|string|max:100',
            'equipment_type' => 'required|string|max:100',
            'origin' => 'required|string|max:100',
            'condition' => 'required|string|max:50',
            'condition_description' => 'nullable|string|max:255',
            'asset_code' => 'required|string|max:100',
        ];

        if ($this->hasFile('photo')) {
            $rules['photo'] = 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak valid.',
            'equipment_name.required' => 'Nama alat wajib diisi.',
            'equipment_name.max' => 'Nama alat maksimal 255 karakter.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'unit.required' => 'Satuan wajib diisi.',
            'unit.max' => 'Satuan maksimal 50 karakter.',
            'brand.required' => 'Merek wajib diisi.',
            'brand.max' => 'Merek maksimal 100 karakter.',
            'equipment_type.required' => 'Tipe alat wajib diisi.',
            'equipment_type.max' => 'Tipe alat maksimal 100 karakter.',
            'origin.required' => 'Asal alat wajib diisi.',
            'origin.max' => 'Asal alat maksimal 100 karakter.',
            'condition.required' => 'Kondisi alat wajib diisi.',
            'condition.max' => 'Kondisi maksimal 50 karakter.',
            'condition_description.max' => 'Keterangan kondisi maksimal 255 karakter.',
            'asset_code.required' => 'Kode aset wajib diisi.',
            'asset_code.max' => 'Kode aset maksimal 100 karakter.',
            'photo.file' => 'Foto harus berupa file.',
            'photo.mimes' => 'Format foto harus JPG, JPEG, PNG, atau WEBP.',
            'photo.max' => 'Ukuran foto maksimal 3 MB.',
        ];
    }
}
