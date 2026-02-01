<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LaboratoryRoomRequest;
use App\Models\LaboratoryRoom;
use App\Models\PracticumSession;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class LaboratoryRoomController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = LaboratoryRoom::query()->with('user');

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $laboratory_rooms = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($laboratory_rooms, "Data ruangan laboratorium berhasil diambil");
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function store(LaboratoryRoomRequest $request)
    {
        try {
            $laboratory_room = LaboratoryRoom::create($request->validated());

            return $this->sendResponse($laboratory_room, "Berhasil menambah data ruangan laboratorium");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function update(LaboratoryRoomRequest $request, $id)
    {
        try {
            $laboratory_room = LaboratoryRoom::findOrFail($id);
            $laboratory_room->update($request->validated());

            return $this->sendResponse($laboratory_room, "Berhasil mengubah data ruangan laboratorium");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Ruangan laboratorium tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $laboratory_room = LaboratoryRoom::findOrFail($id);
            $laboratory_room->delete();

            return $this->sendResponse([], 'Berhasil menghapus data ruangan laboratorium');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Ruangan Laboratorium tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect()
    {
        try {
            $laboratory_rooms = LaboratoryRoom::select('id', 'name', 'student_price', 'lecturer_price', 'external_price')->get();
            return $this->sendResponse($laboratory_rooms, 'Data jenis pengujian berhasil diambil');
        } catch(\Exception $e) {
            return $this->sendError('Gagal mengmbil data ruangan laboratorium', [$e->getMessage()], 400);
        }
    }

    /**
     * Get scheduled sessions for a specific laboratory room
     * Used by frontend to show room availability when creating practicum schedule
     */
    public function getScheduledSessions(Request $request, $id)
    {
        try {
            $room = LaboratoryRoom::findOrFail($id);

            // Default: ambil jadwal 3 bulan ke depan dari hari ini
            $startDate = $request->input('start_date', Carbon::now()->startOfDay()->toDateString());
            $endDate = $request->input('end_date', Carbon::now()->addMonths(3)->endOfDay()->toDateString());

            // Exclude scheduling_id jika ada (untuk mode edit, exclude jadwal sendiri)
            $excludeSchedulingId = $request->input('exclude_scheduling_id');

            $sessions = PracticumSession::query()
                ->whereHas('practicumClass', function ($q) use ($id) {
                    $q->where('laboratory_room_id', $id);
                })
                ->whereHas('practicumClass.practicumScheduling', function ($q) use ($excludeSchedulingId) {
                    // Hanya ambil jadwal dengan status pending atau approved
                    $q->whereIn('status', ['pending', 'approved']);

                    if ($excludeSchedulingId) {
                        $q->where('id', '!=', $excludeSchedulingId);
                    }
                })
                ->whereBetween('start_time', [$startDate, $endDate])
                ->with([
                    'practicumClass:id,name,practicum_scheduling_id',
                    'practicumClass.practicumScheduling:id,practicum_id,status',
                    'practicumClass.practicumScheduling.practicum:id,name'
                ])
                ->orderBy('start_time', 'asc')
                ->get()
                ->map(function ($session) {
                    return [
                        'id' => $session->id,
                        'date' => Carbon::parse($session->start_time)->toDateString(),
                        'start_time' => Carbon::parse($session->start_time)->format('H:i'),
                        'end_time' => Carbon::parse($session->end_time)->format('H:i'),
                        'practicum_name' => $session->practicumClass->practicumScheduling->practicum->name ?? '-',
                        'class_name' => $session->practicumClass->name ?? '-',
                        'status' => $session->practicumClass->practicumScheduling->status ?? '-',
                    ];
                });

            return $this->sendResponse([
                'room' => [
                    'id' => $room->id,
                    'name' => $room->name,
                ],
                'sessions' => $sessions,
            ], 'Jadwal ruangan berhasil diambil');
        } catch (ModelNotFoundException $e) {
            return $this->sendError('Ruangan laboratorium tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil jadwal ruangan', [$e->getMessage()], 500);
        }
    }

    /**
     * Get weekly schedule dashboard for all laboratory rooms
     * Returns schedule data organized by room, date, and session for calendar view
     */
    public function getWeeklyScheduleDashboard(Request $request)
    {
        try {
            // Get week start date (default: current week's Monday)
            $weekStart = $request->input('week_start');
            if ($weekStart) {
                $startDate = Carbon::parse($weekStart)->startOfDay();
            } else {
                $startDate = Carbon::now()->startOfWeek(Carbon::MONDAY)->startOfDay();
            }
            $endDate = $startDate->copy()->addDays(6)->endOfDay();

            // Get optional room filter
            $roomId = $request->input('room_id');

            // Get all rooms
            $roomsQuery = LaboratoryRoom::query()->select('id', 'name')->orderBy('name');
            if ($roomId) {
                $roomsQuery->where('id', $roomId);
            }
            $rooms = $roomsQuery->get();

            // Get all sessions within the week for approved/pending schedules
            $sessionsQuery = PracticumSession::query()
                ->whereHas('practicumClass.practicumScheduling', function ($q) {
                    $q->whereIn('status', ['pending', 'approved']);
                })
                ->whereBetween('start_time', [$startDate, $endDate])
                ->with([
                    'practicumClass:id,name,laboratory_room_id,practicum_scheduling_id,lecturer_id',
                    'practicumClass.lecturer:id,name',
                    'practicumClass.practicumScheduling:id,practicum_id,status',
                    'practicumClass.practicumScheduling.practicum:id,name'
                ]);

            if ($roomId) {
                $sessionsQuery->whereHas('practicumClass', function ($q) use ($roomId) {
                    $q->where('laboratory_room_id', $roomId);
                });
            }

            $sessions = $sessionsQuery->get();

            // Define practicum sessions (time slots)
            $timeSlots = [
                ['id' => 1, 'label' => 'Sesi 1', 'start' => '07:30', 'end' => '10:00'],
                ['id' => 2, 'label' => 'Sesi 2', 'start' => '10:20', 'end' => '12:00'],
                ['id' => 3, 'label' => 'Sesi 3', 'start' => '13:00', 'end' => '15:30'],
                ['id' => 4, 'label' => 'Sesi 4', 'start' => '15:50', 'end' => '17:30'],
            ];

            // Generate dates for the week
            $dates = [];
            for ($i = 0; $i < 7; $i++) {
                $date = $startDate->copy()->addDays($i);
                $dates[] = [
                    'date' => $date->toDateString(),
                    'day_name' => $date->locale('id')->dayName,
                    'day_short' => $date->locale('id')->shortDayName,
                    'is_today' => $date->isToday(),
                ];
            }

            // Organize sessions by room -> date -> session slot
            $scheduleMap = [];
            foreach ($sessions as $session) {
                $roomId = $session->practicumClass->laboratory_room_id;
                $sessionDate = Carbon::parse($session->start_time)->toDateString();
                $sessionStartTime = Carbon::parse($session->start_time)->format('H:i');
                $sessionEndTime = Carbon::parse($session->end_time)->format('H:i');

                // Detect which time slot this session belongs to
                $slotId = null;
                foreach ($timeSlots as $slot) {
                    if ($slot['start'] === $sessionStartTime && $slot['end'] === $sessionEndTime) {
                        $slotId = $slot['id'];
                        break;
                    }
                }

                if ($slotId === null) {
                    // If doesn't match exact slot, find overlapping slot
                    foreach ($timeSlots as $slot) {
                        $slotStart = strtotime($slot['start']);
                        $slotEnd = strtotime($slot['end']);
                        $sessStart = strtotime($sessionStartTime);
                        $sessEnd = strtotime($sessionEndTime);

                        if ($sessStart < $slotEnd && $sessEnd > $slotStart) {
                            $slotId = $slot['id'];
                            break;
                        }
                    }
                }

                if ($slotId) {
                    $key = "{$roomId}_{$sessionDate}_{$slotId}";
                    $scheduleMap[$key] = [
                        'session_id' => $session->id,
                        'practicum_name' => $session->practicumClass->practicumScheduling->practicum->name ?? '-',
                        'class_name' => $session->practicumClass->name ?? '-',
                        'lecturer_name' => $session->practicumClass->lecturer->name ?? '-',
                        'status' => $session->practicumClass->practicumScheduling->status ?? '-',
                        'start_time' => $sessionStartTime,
                        'end_time' => $sessionEndTime,
                    ];
                }
            }

            // Build response structure
            $roomSchedules = $rooms->map(function ($room) use ($dates, $timeSlots, $scheduleMap) {
                $schedule = [];
                foreach ($dates as $dateInfo) {
                    $daySchedule = [];
                    foreach ($timeSlots as $slot) {
                        $key = "{$room->id}_{$dateInfo['date']}_{$slot['id']}";
                        $daySchedule[$slot['id']] = $scheduleMap[$key] ?? null;
                    }
                    $schedule[$dateInfo['date']] = $daySchedule;
                }

                return [
                    'room_id' => $room->id,
                    'room_name' => $room->name,
                    'schedule' => $schedule,
                ];
            });

            return $this->sendResponse([
                'week_start' => $startDate->toDateString(),
                'week_end' => $endDate->toDateString(),
                'dates' => $dates,
                'time_slots' => $timeSlots,
                'rooms' => $roomSchedules,
            ], 'Dashboard jadwal mingguan berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil dashboard jadwal', [$e->getMessage()], 500);
        }
    }
}
