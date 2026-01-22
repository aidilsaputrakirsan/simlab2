<?php

namespace App\Http\Requests;

class PaymentCreateRequest extends ApiRequest
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
            'payment_number' => 'required|max:225',
            'va_number' => 'required|max:225',
            'invoice_file' => 'required|mimes:pdf|max:5046'
        ];
    }

    public function messages(): array
    {
        return [
            'payment_number.required' => 'Nomor pembayaran tidak boleh kosong',
            'payment_number.max' => 'Nomor pembayaran tidak boleh lebih dari 255 karakter',

            'va_number.required' => 'Nomor VA tidak boleh kosong',
            'va_number.max' => 'Nomor VA tidak boleh lebih dari 255 karakter',

            'invoice_file.required' => 'File invoice tidak boleh kosong',
            'invoice_file.mimes' => 'File invoice harus berupa dokumen bertipe pdf.',
            'invoice_file.max' => 'Ukuran file invoice tidak boleh melebihi 5MB.',
        ];
    }
}
