<?php

namespace App\Http\Requests;


class PracticumEquipmenMaterialRequest extends ApiRequest
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
        return [
            // Alat (equipments) tidak required, hanya validasi jika ada
            'practicumSchedulingEquipments' => 'sometimes|array',
            'practicumSchedulingEquipments.*.id' => 'required|distinct|exists:laboratory_equipments,id',
            'practicumSchedulingEquipments.*.quantity' => 'required|integer|min:1',

            'proposedEquipments' => 'sometimes|array',
            'proposedEquipments.*.name' => 'required|string|max:255|distinct',
            'proposedEquipments.*.quantity' => 'required|integer|min:1',

            // Bahan (materials) tidak required, hanya validasi jika ada
            'practicumSchedulingMaterials' => 'sometimes|array',
            'practicumSchedulingMaterials.*.id' => 'required|distinct|exists:laboratory_materials,id',
            'practicumSchedulingMaterials.*.quantity' => 'required|integer|min:1',

            'proposedMaterials' => 'sometimes|array',
            'proposedMaterials.*.name' => 'required|string|max:255|distinct',
            'proposedMaterials.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            // Alat
            'practicumSchedulingEquipments.array' => 'Data alat harus berupa array.',
            'practicumSchedulingEquipments.*.id.required' => 'ID alat wajib diisi.',
            'practicumSchedulingEquipments.*.id.distinct' => 'Terdapat duplikasi ID alat.',
            'practicumSchedulingEquipments.*.id.exists' => 'ID alat tidak ditemukan.',
            'practicumSchedulingEquipments.*.quantity.required' => 'Jumlah alat wajib diisi.',
            'practicumSchedulingEquipments.*.quantity.integer' => 'Jumlah alat harus berupa angka.',
            'practicumSchedulingEquipments.*.quantity.min' => 'Jumlah alat minimal 1.',

            // Bahan
            'practicumSchedulingMaterials.array' => 'Data bahan harus berupa array.',
            'practicumSchedulingMaterials.*.id.required' => 'ID bahan wajib diisi.',
            'practicumSchedulingMaterials.*.id.distinct' => 'Terdapat duplikasi ID bahan.',
            'practicumSchedulingMaterials.*.id.exists' => 'ID bahan tidak ditemukan.',
            'practicumSchedulingMaterials.*.quantity.required' => 'Jumlah bahan wajib diisi.',
            'practicumSchedulingMaterials.*.quantity.integer' => 'Jumlah bahan harus berupa angka.',
            'practicumSchedulingMaterials.*.quantity.min' => 'Jumlah bahan minimal 1.',

            // Alat usulan (proposedEquipments)
            'proposedEquipments.array' => 'Data alat usulan harus berupa array.',
            'proposedEquipments.*.name.required' => 'Nama alat usulan wajib diisi.',
            'proposedEquipments.*.name.string' => 'Nama alat usulan harus berupa teks.',
            'proposedEquipments.*.name.max' => 'Nama alat usulan maksimal 255 karakter.',
            'proposedEquipments.*.name.distinct' => 'Terdapat duplikasi nama alat usulan.',
            'proposedEquipments.*.quantity.required' => 'Jumlah alat usulan wajib diisi.',
            'proposedEquipments.*.quantity.integer' => 'Jumlah alat usulan harus berupa angka.',
            'proposedEquipments.*.quantity.min' => 'Jumlah alat usulan minimal 1.',

            // Bahan usulan (proposedMaterials)
            'proposedMaterials.array' => 'Data bahan usulan harus berupa array.',
            'proposedMaterials.*.name.required' => 'Nama bahan usulan wajib diisi.',
            'proposedMaterials.*.name.string' => 'Nama bahan usulan harus berupa teks.',
            'proposedMaterials.*.name.max' => 'Nama bahan usulan maksimal 255 karakter.',
            'proposedMaterials.*.name.distinct' => 'Terdapat duplikasi nama bahan usulan.',
            'proposedMaterials.*.quantity.required' => 'Jumlah bahan usulan wajib diisi.',
            'proposedMaterials.*.quantity.integer' => 'Jumlah bahan usulan harus berupa angka.',
            'proposedMaterials.*.quantity.min' => 'Jumlah bahan usulan minimal 1.',
        ];
    }
}
