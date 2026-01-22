<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublicationRequest extends ApiRequest
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
        $rules = [
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'slug' => [
                'nullable',
                'string',
                'alpha_dash',
            ],
            'publication_category_id' => 'required|exists:publication_categories,id',
        ];

        // Untuk create, images wajib
        if ($this->isMethod('post')) {
            $rules['images'] = 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
            // Unique rule for slug
            $rules['slug'][] = Rule::unique('publications', 'slug');
        } else {
            // Untuk update, images optional
            $rules['images'] = 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
            $rules['slug'][] = Rule::unique('publications', 'slug')->ignore($this->route('id'));
        }

        return $rules;
    }

    /**
     * Add extra validation to ensure WYSIWYG empty HTML like <p></p> or <p><br></p> is treated as empty.
     */
    protected function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $raw = (string) $this->input('description', '');

            // Normalize and check for empty content after stripping tags and whitespace (including &nbsp;)
            $text = strip_tags($raw);
            $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

            // Remove non-breaking spaces and collapse whitespace
            $text = preg_replace('/\xc2\xa0|&nbsp;/u', ' ', $text);
            $text = trim(preg_replace('/\s+/u', ' ', $text ?? ''));

            // Also handle common Quill empty patterns
            $normalizedHtml = strtolower(trim(preg_replace('/\s+/u', '', $raw)));
            $isEmptyHtml = ($normalizedHtml === '<p></p>' || $normalizedHtml === '<p><br></p>');

            if ($isEmptyHtml || $text === '') {
                $validator->errors()->add('description', 'Deskripsi lengkap wajib diisi.');
            }
        });
    }

    /**
     * Get custom validation messages for request.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul publikasi wajib diisi.',
            'title.string' => 'Judul publikasi harus berupa teks.',
            'title.max' => 'Judul publikasi maksimal 255 karakter.',
            'short_description.required' => 'Deskripsi singkat wajib diisi.',
            'short_description.string' => 'Deskripsi singkat harus berupa teks.',
            'short_description.max' => 'Deskripsi singkat maksimal 500 karakter.',
            'description.required' => 'Deskripsi lengkap wajib diisi.',
            'description.string' => 'Deskripsi lengkap harus berupa teks.',
            'publication_category_id.required' => 'Kategori publikasi wajib dipilih.',
            'publication_category_id.exists' => 'Kategori publikasi tidak valid.',
            'images.required' => 'Gambar publikasi wajib diupload.',
            'images.image' => 'File harus berupa gambar.',
            'images.mimes' => 'Gambar harus berformat jpeg, png, jpg, gif, atau webp.',
            'images.max' => 'Ukuran gambar maksimal 2MB.',
            'slug.alpha_dash' => 'Slug hanya boleh berisi huruf, angka, tanda minus, dan underscore.',
            'slug.unique' => 'Slug sudah digunakan, pilih slug lain.',
        ];
    }
}
