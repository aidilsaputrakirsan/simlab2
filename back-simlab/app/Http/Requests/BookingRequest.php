<?php

namespace App\Http\Requests;

class BookingRequest extends ApiRequest
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
            'phone_number' => 'required|max:14',
            'purpose' => 'required|max:225',
            'supporting_file' => 'nullable|file|mimes:doc,docx,pdf|max:2048',
            'activity_name' => 'required|max:225',
            'start_time' => 'required',
            'end_time' => 'required|after_or_equal:start_time',
            'booking_type' => 'required',
            'total_participant' => 'required|integer|min:1',
            'participant_list' => 'nullable|string',
        ];

        // Add ruangan_laboratorium_id required if booking_type is not null and not 'equipment'
        $bookingType = $this->input('booking_type');
        if (!is_null($bookingType) && $bookingType !== 'equipment') {
            $rules['laboratory_room_id'] = 'required';
        }

        if ($this->user()->role === 'mahasiswa') {
            $rules['supervisor'] = 'max:225|required';
            $rules['supervisor_email'] = 'max:225|required|email';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.max' => 'Nomor telepon tidak boleh lebih dari 15 karakter.',

            'purpose.required' => 'Tujuan peminjaman wajib diisi.',
            'purpose.max' => 'Tujuan peminjaman tidak boleh lebih dari 225 karakter.',

            'supporting_file.file' => 'File pendukung gagal diupload. Pastikan ukuran file tidak melebihi 2MB.',
            'supporting_file.mimes' => 'File pendukung harus berupa dokumen bertipe: doc, docx, atau pdf.',
            'supporting_file.max' => 'Ukuran file pendukung tidak boleh melebihi 2MB.',

            'activity_name.required' => 'Nama kegiatan wajib diisi.',
            'activity_name.max' => 'Nama kegiatan tidak boleh lebih dari 225 karakter.',

            'supervisor.max' => 'Nama penanggung jawab tidak boleh lebih dari 225 karakter.',
            'supervisor.required' => 'Nama penanggung jawab wajib diisi.',

            'supervisor_email.max' => 'Email penanggung jawab tidak boleh lebih dari 225 karakter.',
            'supervisor_email.email' => 'Format email penanggung jawab tidak valid.',
            'supervisor_email.required' => 'Email penanggung jawab wajib diisi.',

            'start_time.required' => 'Tanggal & Waktu mulai wajib diisi.',
            'end_time.required' => 'Tanggal & Waktu wajib diisi.',
            'end_time.after_or_equal' => 'Waktu selesai tidak boleh lebih awal dari waktu mulai.',

            'booking_type.required' => 'Jenis peminjaman wajib dipilih.',

            'total_participant.required' => 'Total peserta wajib diisi.',
            'total_participant.integer' => 'Total peserta harus berupa angka.',
            'total_participant.min' => 'Total peserta minimal 1 orang.',

            'participant_list.string' => 'Daftar peserta harus berupa teks.',

            'laboratory_room_id.required' => 'Ruangan laboratorium wajib dipilih.',
        ];
    }
}
