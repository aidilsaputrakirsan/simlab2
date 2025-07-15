<?php

namespace App\Http\Requests;

class TestingTypeRequest extends ApiRequest
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
            'testing_type' => "required|string|max:255"
        ];
    }

    public function messages(): array
    {
        return [
            'testing_type.required' => 'Jenis Pengujian is required',
        ];
    }
}
