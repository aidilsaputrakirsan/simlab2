<?php

namespace App\Http\Requests;

class StudyProgramRequest extends ApiRequest
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
            'jurusan_id' => 'required',
            'name' => "required|string|max:255|min:4",
        ];
    }

    public function messages(): array
    {
        return [
            'jurusan_id.required' => 'Kode Jurusan is required',
            'name.required' => 'Nama Jurusan is required',
        ];
    }
}
