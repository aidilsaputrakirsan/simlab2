<?php

namespace App\Http\Requests;

class ForgotPasswordRequest extends ApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|max:191',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.max' => 'Email maksimal 191 karakter!',
        ];
    }
}
