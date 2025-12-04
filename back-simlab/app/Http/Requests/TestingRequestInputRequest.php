<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestingRequestInputRequest extends ApiRequest
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
        $rules =  [
            'phone_number' => 'required|max:14',
            'activity_name' => 'required|max:225',
            'supervisor' => 'max:225',
            'supervisor_email' => 'max:225',
            'testing_time' => 'required',
            'information' => 'nullable|string',
            'testing_items' => 'required|array|min:1',
            'testing_items.*.testing_type_id' => 'required|distinct|exists:testing_types,id',
            'testing_items.*.quantity' => 'required|integer|min:1',
            'status' => 'nullable|in:draft'
        ];

        // If supervisor is filled, supervisor_email is required, and vice versa
        if ($this->filled('supervisor') && !$this->filled('supervisor_email')) {
            $rules['supervisor_email'] .= '|required|email';
        }
        if ($this->filled('supervisor_email') && !$this->filled('supervisor')) {
            $rules['supervisor'] .= '|required';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.max' => 'Nomor telepon tidak boleh lebih dari 14 karakter.',
            'activity_name.required' => 'Nama kegiatan wajib diisi.',
            'activity_name.max' => 'Nama kegiatan tidak boleh lebih dari 225 karakter.',
            'supervisor.max' => 'Nama penanggung jawab tidak boleh lebih dari 225 karakter.',
            'supervisor.required' => 'Nama penanggung jawab wajib diisi.',
            'supervisor_email.max' => 'Email penanggung jawab tidak boleh lebih dari 225 karakter.',
            'supervisor_email.email' => 'Format email penanggung jawab tidak valid.',
            'supervisor_email.required' => 'Email penanggung jawab wajib diisi.',
            'testing_time.required' => 'Tanggal & Waktu pengujian wajib diisi.',
            'information.string' => 'Keterangan harus berupa teks.',

            'testing_items.required' => 'Minimal satu jenis pengujian harus dipilih.',
            'testing_items.array' => 'Data jenis pengujian harus berupa array.',
            'testing_items.min' => 'Minimal satu jenis pengujian harus dipilih.',
            'testing_items.*.testing_type_id.required' => 'Jenis pengujian wajib diisi.',
            'testing_items.*.testing_type_id.distinct' => 'Terdapat duplikasi jenis pengujian',
            'testing_items.*.testing_type_id.exists' => 'Jenis pengujian tidak ditemukan.',
            'testing_items.*.quantity.required' => 'Kuantitas pengujian wajib diisi.',
            'testing_items.*.quantity.integer' => 'Kuantitas pengujian harus berupa angka.',
            'testing_items.*.quantity.min' => 'Kuantitas pengujian minimal 1.',
        ];
    }
}
