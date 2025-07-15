<?php

namespace App\Http\Requests;

class LaboratoryRoomRequest extends ApiRequest
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
            'name' => "required|string|max:255|min:4",
            'floor' => "required|string|max:255|min:4",
            'user_id' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama ruangan is required',
            'floor.required' => 'Lokasi lantai is required',
            'user_id.required' => 'Laboran is required',
        ];
    }
}
