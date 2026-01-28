<?php

namespace App\Http\Requests;

class PaymentVerifRequest extends ApiRequest
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
            'action' => 'required|in:approved,rejected',
        ];

        // Receipt file is required only when approving
        if ($this->input('action') === 'approved') {
            $rules['receipt_file'] = 'required|mimes:pdf|max:2048';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Aksi tidak boleh kosong.',
            'action.in' => 'Aksi harus berupa approved atau rejected.',
            'receipt_file.required' => 'File kwitansi tidak boleh kosong.',
            'receipt_file.mimes' => 'File kwitansi harus berupa file PDF.',
            'receipt_file.max' => 'Ukuran file kwitansi maksimal 2MB.',
        ];
    }
}
