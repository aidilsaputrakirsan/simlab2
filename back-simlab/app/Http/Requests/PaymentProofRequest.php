<?php

namespace App\Http\Requests;

class PaymentProofRequest extends ApiRequest
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
            'payment_proof' => 'required|mimes:jpg,jpeg,png|max:2048'
        ];
    }

    public function messages(): array
    {
        return [
            'payment_proof.required' => 'Bukti pembayaran tidak boleh kosong.',
            'payment_proof.mimes' => 'Bukti pembayaran harus berupa gambar dengan format jpg, jpeg, atau png.',
            'payment_proof.max' => 'Ukuran bukti pembayaran maksimal 2MB.',
        ];
    }
}
