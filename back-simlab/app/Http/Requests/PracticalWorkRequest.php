<?php

namespace App\Http\Requests;

class PracticalWorkRequest extends ApiRequest
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
            'name' => 'required|string|max:255|min:4',
            'prodi_id' => 'required',
            'sks' => 'required|numeric|min:1'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama praktikum is required',
            'prodi_id.required' => 'Prodi is required',
            'sks.required' => 'SKS is required'
        ];
    }
}
