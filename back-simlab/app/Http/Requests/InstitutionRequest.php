<?php

namespace App\Http\Requests;

class InstitutionRequest extends ApiRequest
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
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Institusi wajib diisi',
            'name.string' => 'Institusi harus berupa teks',
            'name.max' => 'Institusi maksimal 255 karakter',
        ];
    }
}
