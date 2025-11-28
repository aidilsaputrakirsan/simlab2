<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestingCategoryRequest extends ApiRequest
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
            'name' => 'required|string|max:255'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori pengjujian wajib diisi',
            'name.string' => 'Nama kategori pengjujian harus berupa teks',
            'name.max' => 'Nama kategori pengjujian maksimal 255 karakter',
        ];
    }
}
