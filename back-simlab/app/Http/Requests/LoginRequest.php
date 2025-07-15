<?php

namespace App\Http\Requests;

class LoginRequest extends ApiRequest
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
            'email' => 'required|email|max:191',
            'password' => 'required|max:191',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.max' => 'Email maksimal 191 karakter!',
            'password.required' => 'Password tidak boleh kosong!',
            'password.max' => 'Password maksimal 191 karakter!',
        ];
    }
}
