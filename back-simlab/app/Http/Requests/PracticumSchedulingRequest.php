<?php

namespace App\Http\Requests;

use App\Models\PracticumSession;
use App\Models\LaboratoryRoom;
use Illuminate\Validation\Validator;

class PracticumSchedulingRequest extends ApiRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'practicum_id' => 'required|exists:practicums,id',
            'phone_number' => 'required|max:15',
            'classes' => 'required|array|min:1',
            'classes.*.lecturer_id' => 'required|exists:users,id',
            'classes.*.laboratory_room_id' => 'required|exists:laboratory_rooms,id',
            'classes.*.name' => 'required|string',
            'classes.*.practicum_assistant' => 'nullable|string',
            'classes.*.total_participant' => 'required|integer|min:1',
            'classes.*.total_group' => 'required|integer|min:1',
            'classes.*.sessions' => 'required|array|min:1',
            'classes.*.sessions.*.practicum_module_id' => 'required|exists:practicum_modules,id',
            'classes.*.sessions.*.start_time' => 'required|date',
            'classes.*.sessions.*.end_time' => 'required|date|after_or_equal:classes.*.sessions.*.start_time',
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $this->validateSessionScheduleConflicts($validator);
            $this->validateExistingScheduleConflicts($validator);
        });
    }

    protected function validateSessionScheduleConflicts(Validator $validator)
    {
        $classes = $this->input('classes', []);

        // Validasi 0: Cek modul praktikum tidak boleh duplikat dalam satu kelas
        foreach ($classes as $classIndex => $class) {
            $sessions = $class['sessions'] ?? [];
            $moduleIds = [];

            foreach ($sessions as $sessionIndex => $session) {
                $moduleId = $session['practicum_module_id'] ?? null;

                if ($moduleId && in_array($moduleId, $moduleIds)) {
                    $validator->errors()->add(
                        "classes.{$classIndex}.sessions.{$sessionIndex}.practicum_module_id",
                        "Modul praktikum yang sama tidak boleh digunakan lebih dari sekali dalam satu kelas."
                    );
                }

                if ($moduleId) {
                    $moduleIds[] = $moduleId;
                }
            }
        }

        // Validasi 1: Cek tabrakan session dalam satu class
        foreach ($classes as $classIndex => $class) {
            $sessions = $class['sessions'] ?? [];

            if (count($sessions) > 1) {
                for ($i = 0; $i < count($sessions); $i++) {
                    for ($j = $i + 1; $j < count($sessions); $j++) {
                        $session1 = $sessions[$i];
                        $session2 = $sessions[$j];

                        if ($this->sessionsOverlap($session1, $session2)) {
                            $validator->errors()->add(
                                "classes.{$classIndex}.sessions",
                                "Terdapat jadwal sesi yang bertabrakan"
                            );
                        }
                    }
                }
            }
        }

        // Validasi 2: Cek tabrakan session di class berbeda dengan laboratory room yang sama
        for ($i = 0; $i < count($classes); $i++) {
            for ($j = $i + 1; $j < count($classes); $j++) {
                $class1 = $classes[$i];
                $class2 = $classes[$j];

                // Jika laboratory room sama, cek apakah ada tabrakan session
                if ($class1['laboratory_room_id'] === $class2['laboratory_room_id']) {
                    $sessions1 = $class1['sessions'] ?? [];
                    $sessions2 = $class2['sessions'] ?? [];

                    foreach ($sessions1 as $sessionIndex1 => $session1) {
                        foreach ($sessions2 as $sessionIndex2 => $session2) {
                            if ($this->sessionsOverlap($session1, $session2)) {
                                $validator->errors()->add(
                                    "classes.{$i}.sessions",
                                    "Terdapat jadwal sesi kelas {$classes[$i]['name']} yang bertabrakan dengan kelas {$classes[$j]['name']} karena menggunakan ruangan yang sama."
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    protected function sessionsOverlap($session1, $session2): bool
    {
        $start1 = strtotime($session1['start_time']);
        $end1 = strtotime($session1['end_time']);
        $start2 = strtotime($session2['start_time']);
        $end2 = strtotime($session2['end_time']);

        // Dua session bertabrakan jika:
        // start1 < end2 AND start2 < end1
        return $start1 < $end2 && $start2 < $end1;
    }

    /**
     * Validasi konflik jadwal dengan jadwal yang sudah ada di database
     * Cek jadwal dengan status 'pending' dan 'approved'
     */
    protected function validateExistingScheduleConflicts(Validator $validator)
    {
        $classes = $this->input('classes', []);
        $currentSchedulingId = $this->route('id'); // null jika create, ada nilai jika update

        foreach ($classes as $classIndex => $class) {
            $roomId = $class['laboratory_room_id'] ?? null;
            $sessions = $class['sessions'] ?? [];
            $room = $roomId ? LaboratoryRoom::find($roomId) : null;
            $roomName = $room ? $room->name : 'Ruangan';

            foreach ($sessions as $sessionIndex => $session) {
                $startTime = $session['start_time'] ?? null;
                $endTime = $session['end_time'] ?? null;

                if (!$roomId || !$startTime || !$endTime) {
                    continue;
                }

                // Query untuk cek konflik dengan jadwal existing
                $conflictQuery = PracticumSession::query()
                    ->whereHas('practicumClass', function ($q) use ($roomId) {
                        $q->where('laboratory_room_id', $roomId);
                    })
                    ->whereHas('practicumClass.practicumScheduling', function ($q) use ($currentSchedulingId) {
                        // Hanya cek jadwal dengan status pending atau approved
                        $q->whereIn('status', ['pending', 'approved']);

                        // Exclude jadwal sendiri jika mode edit
                        if ($currentSchedulingId) {
                            $q->where('id', '!=', $currentSchedulingId);
                        }
                    })
                    // Cek overlap waktu: start1 < end2 AND start2 < end1
                    ->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);

                $existingSession = $conflictQuery->with(['practicumClass.practicumScheduling.practicum'])->first();

                if ($existingSession) {
                    $existingPracticum = $existingSession->practicumClass->practicumScheduling->practicum->name ?? 'Praktikum lain';
                    $existingClass = $existingSession->practicumClass->name ?? '';
                    $existingDate = date('d M Y', strtotime($existingSession->start_time));
                    $existingStartTime = date('H:i', strtotime($existingSession->start_time));
                    $existingEndTime = date('H:i', strtotime($existingSession->end_time));

                    $validator->errors()->add(
                        "classes.{$classIndex}.sessions.{$sessionIndex}.start_time",
                        "Jadwal bertabrakan dengan {$existingPracticum} - {$existingClass} di {$roomName} pada {$existingDate} ({$existingStartTime} - {$existingEndTime})"
                    );
                }
            }
        }
    }

    public function messages()
    {
        return [
            'practicum_id.required' => 'Praktikum wajib diisi.',
            'practicum_id.exists' => 'Praktikum tidak ditemukan.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.max' => 'Nomor telepon maksimal 15 karakter.',
            'classes.required' => 'Minimal satu kelas harus diisi.',
            'classes.array' => 'Format kelas tidak valid.',
            'classes.min' => 'Minimal satu kelas harus diisi.',
            'classes.*.lecturer_id.required' => 'Dosen pengampu wajib diisi.',
            'classes.*.lecturer_id.exists' => 'Dosen pengampu tidak ditemukan.',
            'classes.*.laboratory_room_id.required' => 'Ruangan laboratorium wajib diisi.',
            'classes.*.laboratory_room_id.exists' => 'Ruangan laboratorium tidak ditemukan.',
            'classes.*.name.required' => 'Nama kelas wajib diisi.',
                        'classes.*.total_participant.required' => 'Jumlah peserta wajib diisi.',
            'classes.*.total_participant.integer' => 'Jumlah peserta harus berupa angka.',
            'classes.*.total_participant.min' => 'Jumlah peserta minimal 1 orang.',
            'classes.*.total_group.required' => 'Jumlah kelompok wajib diisi.',
            'classes.*.total_group.integer' => 'Jumlah kelompok harus berupa angka.',
            'classes.*.total_group.min' => 'Jumlah kelompok minimal 1.',
            'classes.*.sessions.required' => 'Minimal satu sesi harus diisi.',
            'classes.*.sessions.array' => 'Format sesi tidak valid.',
            'classes.*.sessions.min' => 'Minimal satu sesi harus diisi.',
            'classes.*.sessions.*.practicum_module_id.required' => 'Modul praktikum wajib diisi.',
            'classes.*.sessions.*.practicum_module_id.exists' => 'Modul praktikum tidak ditemukan.',
            'classes.*.sessions.*.start_time.required' => 'Waktu mulai sesi wajib diisi.',
            'classes.*.sessions.*.start_time.date' => 'Waktu mulai sesi harus berupa tanggal yang valid.',
            'classes.*.sessions.*.end_time.required' => 'Waktu selesai sesi wajib diisi.',
            'classes.*.sessions.*.end_time.date' => 'Waktu selesai sesi harus berupa tanggal yang valid.',
            'classes.*.sessions.*.end_time.after_or_equal' => 'Waktu selesai sesi harus setelah atau sama dengan waktu mulai.',
            'classes.*.sessions.schedule_conflict' => 'Jadwal session bertabrakan.',
        ];
    }
}
