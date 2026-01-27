<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PracticumEquipmenMaterialRequest;
use App\Http\Requests\PracticumSchedulingLecturerNoteRequest;
use App\Http\Requests\PracticumSchedulingRequest;
use App\Http\Requests\PracticumSchedulingSessionConductedRequest;
use App\Http\Requests\PracticumSchedulingVerifyRequest;
use App\Http\Resources\PracticumScheduling\PracticumSchedulingResource;
use App\Models\PracticumApproval;
use App\Models\PracticumScheduling;
use App\Models\PracticumSchedulingEquipment;
use App\Models\PracticumSchedulingMaterial;
use App\Models\AcademicYear;
use App\Models\Event;
use App\Models\LaboratoryEquipment;
use App\Models\LaboratoryTemporaryEquipment;
use App\Models\PracticumClass;
use App\Models\PracticumSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PracticumSchedulingController extends BaseController
{
    private $activeAcademicYear;

    public function __construct()
    {
        $this->activeAcademicYear = AcademicYear::where('status', 'Active')->first();
    }

    // get Practicum Scheduling data for kepala lab jurusan
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = PracticumScheduling::query()->with(['user', 'practicum', 'academicYear']);

            $user = auth()->user();

            if ($this->activeAcademicYear) {
                $query->where('academic_year_id', $this->activeAcademicYear->id);
            }

            // Allow kepala_lab_jurusan to view all schedules in their Major (Jurusan) + their own
            if ($user->role === 'kepala_lab_jurusan') {
                $query->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id);

                    if ($user->study_program_id) {
                        $user->load('studyProgram.major');
                        $majorId = $user->studyProgram?->major_id;

                        if ($majorId) {
                            $q->orWhereHas('practicum.studyProgram', function ($sq) use ($majorId) {
                                $sq->where('major_id', $majorId);
                            });
                        }
                    }
                });
            } else {
                // Default: User only sees their own schedules
                $query->where('user_id', $user->id);
            }

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->orWhereHas('user', function ($userQ) use ($searchTerm) {
                        $userQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                    $q->orWhereHas('practicum', function ($practicumQ) use ($searchTerm) {
                        $practicumQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            // Execute pagination
            $practicumSchedulings = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $practicumSchedulings->currentPage(),
                'last_page' => $practicumSchedulings->lastPage(),
                'per_page' => $practicumSchedulings->perPage(),
                'total' => $practicumSchedulings->total(),
                'data' => PracticumSchedulingResource::collection($practicumSchedulings)
            ];

            return $this->sendResponse($response, "Practicum Scheduling retrieved successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Practicum Scheduling', [$e->getMessage()], 500);
        }
    }

    // get Practicum Scheduling data for laboran & kepala lab terpadu
    public function getPracticumSchedulingForVerification(Request $request)
    {
        try {
            $user = auth()->user();

            $query = PracticumScheduling::query()->with(['user', 'practicum', 'academicYear']);
            $query->where('academic_year_id', $this->activeAcademicYear->id);
            $query->where('status', '<>', 'draft');

            if ($user->role === 'laboran') {
                // Restrict to assignments for this laboran
                $query->where('laboran_id', $user->id);

                // Eager-load additional relations laboran needs for verification details
                $query->with([
                    'practicumSchedulingMaterials.laboratoryMaterial',
                ]);
            }

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->orWhereHas('user', function ($userQ) use ($searchTerm) {
                        $userQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                    $q->orWhereHas('practicum', function ($practicumQ) use ($searchTerm) {
                        $practicumQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);
            $query->orderBy('created_at', 'desc');

            // Execute pagination
            $practicumSchedulings = $query->paginate($perPage, ['*'], 'page', $page);
            $response = [
                'current_page' => $practicumSchedulings->currentPage(),
                'last_page' => $practicumSchedulings->lastPage(),
                'per_page' => $practicumSchedulings->perPage(),
                'total' => $practicumSchedulings->total(),
                'data' => PracticumSchedulingResource::collectionWithApproval($practicumSchedulings)
            ];

            return $this->sendResponse($response, "Practicum Scheduling retrieved successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Practicum Scheduling', [$e->getMessage()], 500);
        }
    }

    public function getPracticumSchedulingByLecturer(Request $request)
    {
        try {
            $user = auth()->user();
            $query = PracticumScheduling::query()
                ->with(['user', 'practicum', 'academicYear'])
                ->with([
                    'practicumClasses' => function ($q) use ($user) {
                        $q->where('lecturer_id', $user->id)->with('lecturer');
                    }
                ])
                ->where('status', 'approved')
                ->whereHas('practicumClasses', function ($q) use ($user) {
                    $q->where('lecturer_id', $user->id);
                });

            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->orWhereHas('user', function ($userQ) use ($searchTerm) {
                        $userQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                    $q->orWhereHas('practicum', function ($practicumQ) use ($searchTerm) {
                        $practicumQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            // Execute pagination
            $practicumSchedulings = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $practicumSchedulings->currentPage(),
                'last_page' => $practicumSchedulings->lastPage(),
                'per_page' => $practicumSchedulings->perPage(),
                'total' => $practicumSchedulings->total(),
                'data' => PracticumSchedulingResource::collection($practicumSchedulings)
            ];

            return $this->sendResponse($response, "Practicum Scheduling retrieved successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Practicum Scheduling', [$e->getMessage()], 500);
        }
    }

    public function verifyPracticumScheduling(PracticumSchedulingVerifyRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();

            $practicumScheduling = PracticumScheduling::findOrFail($id);
            $status = $practicumScheduling->status;

            // Do validation restriction based on status
            if ($status === 'draft') {
                DB::rollBack();
                return $this->sendError('Penjadwalan harus disubmit terlebih dahulu sebelum dapat diverifikasi.', [], 400);
            }

            if ($status !== 'pending') {
                DB::rollBack();
                return $this->sendError('Peminjaman ini telah dilakukan verifikasi sebelumnya', [], 400);
            }

            if ($practicumScheduling->canVerif($user) !== 1) {
                return $this->sendError('Anda tidak diizinkan untuk melakukan verifikasi', [], 400);
            }

            $isApprove = $request->action === 'approve' ? 1 : ($request->action === 'revision' ? 2 : 0);
            $response = $this->assignPracticumSchedulingDataByRole($practicumScheduling, $user, $request, $isApprove);
            if ($response) {
                // assignPracticumSchedulingDataByRole may already roll back; just return the error response
                return $response;
            }

            $approvalAction = $user->role === 'laboran' ? 'verified_by_laboran' : 'verified_by_head';
            $this->recordApproval($practicumScheduling->id, $approvalAction, $user->id, $isApprove, $request->information);

            DB::commit();
            return $this->sendResponse([], 'Berhasil melakukan verifikasi pengajuan penjadwalan praktikum');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Practicum Scheduling Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify practicum scheduling', [$e->getMessage()], 500);
        }
    }

    public function isStillHaveDraftPracticum()
    {
        // Menampilan authenticate user
        $user = auth()->user();

        /*
        Menampilan data booking (peminjaman)
        dengan user berdasakan authenticate user
        */
        $query = PracticumScheduling::where('status', 'draft');
        $query->where('user_id', $user->id);
        $practicumScheduling = $query->first();

        if ($practicumScheduling) {
            return $this->sendResponse(1, 'Practicum Data Retrieved Successfully');
        }

        return $this->sendError('No draft', [], 404);
    }

    public function store(PracticumSchedulingRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = auth()->user();
            $data['user_id'] = $user->id;
            $data['academic_year_id'] = $this->activeAcademicYear->id;
            $data['status'] = 'draft';

            // Remove nested data before creating main scheduling
            $classes = $data['classes'] ?? [];
            unset($data['classes']);

            $practicumScheduling = PracticumScheduling::create($data);

            $this->createClassesAndSessions($practicumScheduling->id, $classes);

            DB::commit();
            return $this->sendResponse($practicumScheduling->load(['user', 'practicum']), "Practicum Scheduling Created Successfully");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create practicum scheduling', [$e->getMessage()], 500);
        }
    }

    public function update(PracticumSchedulingRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $practicumScheduling = PracticumScheduling::findOrFail($id);

            if ($practicumScheduling->status !== 'draft') {
                DB::rollBack();
                return $this->sendError('Hanya penjadwalan dengan status draft yang dapat diubah.', [], 400);
            }

            $user = auth()->user();
            if ($practicumScheduling->user_id !== $user->id) {
                DB::rollBack();
                return $this->sendError('Anda tidak memiliki akses untuk mengubah data ini.', [], 403);
            }

            $data = $request->validated();

            $classes = $data['classes'] ?? [];
            unset($data['classes']);

            // Update parent data
            $practicumScheduling->update($data);

            // Delete existing classes (and sessions via cascade or manually if needed)
            // Manual delete to ensuring all childs are deleted
            foreach ($practicumScheduling->practicumClasses as $class) {
                $class->practicumSessions()->delete();
                $class->delete();
            }

            // Re-create classes and sessions
            $this->createClassesAndSessions($practicumScheduling->id, $classes);

            DB::commit();
            return $this->sendResponse($practicumScheduling->load(['user', 'practicum']), "Practicum Scheduling Updated Successfully");
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Practicum Scheduling Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to update practicum scheduling', [$e->getMessage()], 500);
        }
    }

    private function createClassesAndSessions($schedulingId, $classes)
    {
        foreach ($classes as $key => $class) {
            $classData = [
                'practicum_scheduling_id' => $schedulingId,
                'lecturer_id' => $class['lecturer_id'],
                'laboratory_room_id' => $class['laboratory_room_id'],
                'name' => $class['name'],
                'practicum_assistant' => $class['practicum_assistant'],
                'total_participant' => $class['total_participant'],
                'total_group' => $class['total_group']
            ];

            $sessions = $class['sessions'] ?? [];
            $practicumClass = PracticumClass::create($classData);

            foreach ($sessions as $key => $session) {
                $sessionData = [
                    'practicum_class_id' => $practicumClass->id,
                    'practicum_module_id' => $session['practicum_module_id'],
                    'start_time' => Carbon::parse($session['start_time'])->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s'),
                    'end_time' => Carbon::parse($session['end_time'])->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s')
                ];

                PracticumSession::create($sessionData);
            }
        }
    }

    public function storePracticumEquipmentMaterial(PracticumEquipmenMaterialRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $practicumScheduling = PracticumScheduling::with(['practicumSchedulingEquipments', 'practicumSchedulingMaterials'])->findOrFail($id);
            $user = auth()->user();

            $data = $request->validated();

            if (!in_array($practicumScheduling->status, ['draft'])) {
                DB::rollBack();
                return $this->sendError('Status booking tidak mengizinkan penambahan data.', [], 400);
            }

            // Prevent Duplicated
            if ($this->hasExistingEquipmentOrMaterial($practicumScheduling)) {
                DB::rollBack();
                return $this->sendError('Alat atau bahan sudah pernah ditambahkan.', [], 400);
            }

            // Insert equipments (existing laboratory equipments)
            $this->storeEquipments($practicumScheduling, $data['practicumSchedulingEquipments'] ?? []);
            // Insert proposed equipments (temporary equipments stored separately)
            $this->storeProposedEquipments($practicumScheduling, $data['proposedEquipments'] ?? []);
            // Insert materials
            $this->storeMaterials($practicumScheduling, $data['practicumSchedulingMaterials'] ?? []);

            // Update status jika draft
            if ($practicumScheduling->status === 'draft') {
                $practicumScheduling->update(['status' => 'pending']);
            }

            $this->recordApproval($practicumScheduling->id, 'request_practicum', $user->id, 1);

            DB::commit();
            return $this->sendResponse([], 'Practicum Equipment & Material Submitted Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Practicum Scheduling Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to submit practicum scheduling data', [$e->getMessage()], 500);
        }
    }

    public function getPracticumSchedulingData($id)
    {
        try {
            $user = auth()->user();
            $practicumScheduling = PracticumScheduling::with([
                'user.studyProgram',
                'laboran',
                'practicum',
                'practicumClasses.practicumSessions.practicumModule',
                'practicumClasses.laboratoryRoom',
                'practicumSchedulingEquipments.equipmentable',
                'practicumSchedulingMaterials.laboratoryMaterial'
            ]);
            // Apply conditional relationship filter if the user is a dosen
            if ($user->role === 'dosen') {
                $practicumScheduling->with([
                    'practicumClasses' => function ($q) use ($user) {
                        $q->where('lecturer_id', $user->id)->with('lecturer');
                    },
                ]);
            } else {
                $practicumScheduling->with([
                    'practicumClasses.lecturer',
                ]);
            }

            $practicumScheduling = $practicumScheduling->findOrFail($id);

            return $this->sendResponse(new PracticumSchedulingResource($practicumScheduling), 'Practicum Scheduling Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Practicum Scheduling Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve practicum scheduling', [$e->getMessage()], 500);
        }
    }

    public function getPracticumSchedulingApproval($id)
    {
        try {
            $practicumScheduling = PracticumScheduling::with(['practicumApprovals.approver'])->findOrFail($id);
            return $this->sendResponse($practicumScheduling->approval_steps, 'Berhasil mengambil data pengujian');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data pengujian', [$e->getMessage()]);
        }
    }

    public function setSessionConducted(PracticumSchedulingSessionConductedRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            // Find the session to update
            $session = PracticumSession::findOrFail($request->session_id);

            if (!$this->isAllowToConducted($session->start_time)) {
                return $this->sendError('Sesi yang dapat diisi hanya yang sudah masuk ke dalam minggu pelaksanaan kelas', [], 403);
            }

            $this->isConductedSession($id, $session->id);

            // Update status
            $session->is_class_conducted = $request->status;
            if ($request->filled('information')) {
                $session->laboran_comment = $request->information;
                $session->laboran_commented_at = now();
            }
            $session->save();

            DB::commit();
            return $this->sendResponse([], 'Berhasil mengubah status sesi praktikum');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError("Penjadwalan praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to retrieve practicum scheduling', [$e->getMessage()], 500);
        }
    }

    public function setLecturerNote(PracticumSchedulingLecturerNoteRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();

            $session = PracticumSession::findOrFail($request->session_id);

            if (!$this->isAllowToConducted($session->start_time)) {
                return $this->sendError('Sesi yang dapat diisi hanya yang sudah masuk ke dalam minggu pelaksanaan kelas', [], 403);
            }

            $this->isConductedSession($id, $session->id, $user);

            // Update status
            if ($request->filled('information')) {
                $session->lecturer_comment = $request->information;
                $session->lecturer_commented_at = now();
            }
            $session->save();

            DB::commit();
            return $this->sendResponse([], 'Berhasil mengubah status sesi praktikum');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError("Penjadwalan praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to retrieve practicum scheduling', [$e->getMessage()], 500);
        }
    }


    // Helper
    private function isAllowToConducted($startTime): int
    {
        // Ambil waktu sekarang
        $now = Carbon::now();

        // Awal minggu (Minggu)
        $startOfWeek = $now->copy()->startOfWeek(Carbon::SUNDAY);

        // Akhir minggu (Sabtu)
        $endOfWeek = $now->copy()->endOfWeek(Carbon::SATURDAY);

        // Jika tanggal target masih di masa depan dan belum masuk minggu ini
        if ($startTime->greaterThan($endOfWeek)) {
            return 0;
        }

        // Jika tanggal sudah dalam minggu ini atau sebelumnya
        return 1;
    }

    private function isConductedSession($id, $session_id, $user = null)
    {
        // Retrieve the scheduling with its nested relationships
        $practicumScheduling = PracticumScheduling::with([
            'practicumClasses.practicumSessions',
        ])->findOrFail($id);

        // Ensure the session belongs to this scheduling (for safety)
        $class = $practicumScheduling
            ->practicumClasses
            ->first(fn($class) => $class->practicumSessions->contains('id', $session_id));

        if (!$class) {
            return $this->sendError('Sesi yang anda masukan tidak tersedia pada penjadwalan ini', [], 403);
        }

        if ($user) {
            if ($class->lecturer_id !== $user->id) {
                return $this->sendError('Anda tidak memiliki hak untuk mengubah sesi ini', [], 403);
            }
        }
    }

    private function hasExistingEquipmentOrMaterial($scheduling)
    {
        return (
            ($scheduling->practicumSchedulingEquipments && $scheduling->practicumSchedulingEquipments->isNotEmpty()) ||
            ($scheduling->practicumSchedulingMaterials && $scheduling->practicumSchedulingMaterials->isNotEmpty())
        );
    }

    private function storeEquipments($scheduling, array $equipments)
    {
        foreach ($equipments as $eq) {
            PracticumSchedulingEquipment::create([
                'practicum_scheduling_id' => $scheduling->id,
                'quantity' => $eq['quantity'],
                'equipmentable_id' => $eq['id'],
                'equipmentable_type' => LaboratoryEquipment::class,
            ]);
        }
    }

    private function storeProposedEquipments($scheduling, array $proposedEquipments)
    {
        foreach ($proposedEquipments as $p) {
            $temp = LaboratoryTemporaryEquipment::create([
                'name' => $p['name']
            ]);

            PracticumSchedulingEquipment::create([
                'practicum_scheduling_id' => $scheduling->id,
                'quantity' => $p['quantity'],
                'equipmentable_id' => $temp->id,
                'equipmentable_type' => LaboratoryTemporaryEquipment::class,
            ]);
        }
    }

    private function storeMaterials($scheduling, array $materials)
    {
        foreach ($materials as $mt) {
            PracticumSchedulingMaterial::create([
                'practicum_scheduling_id' => $scheduling->id,
                'laboratory_material_id' => $mt['id'],
                'quantity' => $mt['quantity'] * $scheduling->total_groups
            ]);
        }
    }

    private function recordApproval($practicumSchedulingId, $action, $approverId, $status, $information = null)
    {
        PracticumApproval::create([
            'practicum_scheduling_id' => $practicumSchedulingId,
            'action' => $action,
            'approver_id' => $approverId,
            'is_approved' => $status,
            'information' => $information
        ]);
    }

    private function assignPracticumSchedulingDataByRole($practicumScheduling, $user, $request, $isApprove)
    {
        // is REJECTED
        if (!$isApprove) {
            $practicumScheduling->update(['status' => 'rejected']);

            // Notify applicant about rejection

            return null;
        }

        // is APPROVED
        switch ($user->role) {
            case 'kepala_lab_terpadu':
                // Assign laboran
                $practicumScheduling->update(['laboran_id' => $request->laboran_id]);

                // Notify the assigned laboran
                return null;

            case 'laboran':
                if ($request->filled('materials')) {
                    $materials = $request->materials;
                    foreach ($practicumScheduling->practicumSchedulingMaterials as $key => $material) {
                        $realization = $materials[$key] ?? 0;

                        if ($realization <= 0) {
                            return $this->sendError('Terjadi kesalahan dalam proses verifikasi', ['materials' => 'Minimal bahan yang disediakan lebih dari 0'], 400);
                        }

                        if ($realization > $material->quantity) {
                            return $this->sendError('Terjadi kesalahan dalam proses verifikasi', ['materials' => 'Terdapat bahan yang melebihi jumlah yang diajukan'], 400);
                        }

                        $material->update(['realization' => $request->materials[$key]]);
                    }

                }
                // Final approval (laboran confirms everything)
                $practicumScheduling->update(['status' => 'approved']);

                // Create event for approved practicum scheduling
                $this->createPracticumSchedulingEvents($practicumScheduling);

                // Notify applicant
                return null;
        }
    }

    private function createPracticumSchedulingEvents($practicumScheduling)
    {
        // Load practicum classes with sessions if not already loaded
        $practicumScheduling->load('practicumClasses.practicumSessions', 'practicum');

        foreach ($practicumScheduling->practicumClasses as $class) {
            foreach ($class->practicumSessions as $session) {
                Event::create([
                    'eventable_id' => $session->id,
                    'eventable_type' => PracticumSession::class,
                    'title' => $practicumScheduling->practicum->name . ' - ' . $class->name,
                    'start_date' => $session->start_time,
                    'end_date' => $session->end_time,
                ]);
            }
        }
    }
}
