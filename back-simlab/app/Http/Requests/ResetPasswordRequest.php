<?php

namespace App\Http\Requests;

class ResetPasswordRequest extends ApiRequest
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
            'token' => 'required|string',
            'email' => 'required|email|max:191',
            'password' => 'required|min:8|max:191',
            'c_password' => 'required|same:password',
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'Token reset password tidak ditemukan!',

            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.max' => 'Email maksimal 191 karakter!',

            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal 8 karakter!',
            'password.max' => 'Password maksimal 191 karakter!',

            'c_password.required' => 'Konfirmasi password tidak boleh kosong!',
            'c_password.same' => 'Konfirmasi password tidak cocok dengan password!',
        ];
    }
}
