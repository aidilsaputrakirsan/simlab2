<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestingRequestVerifyRequest extends ApiRequest
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
        $user = $this->user();
        $laboranIdRule = 'exists:users,id';
        if (!$user || $user->role !== 'laboran') {
            $laboranIdRule = 'required_if:action,approve|' . $laboranIdRule;
        } else {
            // Laboran tidak perlu input laboran_id saat approve
            $laboranIdRule = 'nullable|' . $laboranIdRule;
        }

        return [
            'action' => 'required|in:approve,reject,revision',
            'laboran_id' => $laboranIdRule,
            'information' => 'required_if:action,reject,revision',
        ];
    }

    public function messages()
    {
        return [
            'action.required' => 'Aksi verifikasi wajib dipilih.',
            'action.in' => 'Aksi verifikasi tidak valid.',
            'laboran_id.required_if' => 'Pilih laboran terlebih dahulu untuk melakukan persetujuan.',
            'laboran_id.exists' => 'Laboran yang dipilih tidak ditemukan.',
            'laboran_id.nullable' => 'Laboran boleh dikosongkan.',
            'information.required_if' => 'Alasan penolakan atau revisi wajib diisi.',
            'information.filled' => 'Alasan wajib diisi.',
        ];
    }
}
