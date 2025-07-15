<?php

namespace App\Http\Requests;

class AcademicYearRequest extends ApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        $uniqueRule = "unique:tahun_akademiks,academic_year";
        if ($id) {
            $uniqueRule .= ",{$id},id";
        }

        return [
            'academic_year' => ['required', 'string', 'max:255', $uniqueRule],
        ];
    }

    public function messages(): array
    {
        return [
            'academic_year.required' => 'Tahun Akademik is required',
            'academic_year.unique' => 'Tahun Akademik already exists',
        ];
    }
}
