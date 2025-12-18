<?php

namespace App\Http\Requests;

class AsignRoleRequest extends ApiRequest
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
            'user_id' => 'required|exists:users,id',
            'role' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Harap pilih user terlebih dahulu',
            'user_id.exists' => 'User tidak ditemukan',
            'role.required' => 'harap pilih user terlebih dahulu'
        ];
    }
}
