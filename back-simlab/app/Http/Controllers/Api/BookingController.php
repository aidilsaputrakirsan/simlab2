<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\BookingRequest;
use App\Http\Requests\BookingEquipmentMaterialRequest;
use App\Http\Requests\BookingEquipmentRequest;
use App\Http\Requests\BookingReturnRequest;
use App\Http\Requests\BookingVerifyRequest;
use App\Http\Resources\Booking\BookingApprovalResource;
use App\Http\Resources\Booking\BookingResource;
use App\Mail\BookingNotification;
use App\Mail\BookingNotificationKepalaLabApproved;
use App\Mail\BookingNotificationLaboranApproved;
use App\Mail\BookingNotificationRejected;
use App\Mail\BookingNotificationSupervisor;
use App\Models\Booking;
use App\Models\BookingApproval;
use App\Models\BookingEquipment;
use App\Models\BookingMaterial;
use App\Models\AcademicYear;
use App\Models\Event;
use App\Models\LaboratoryEquipment;
use App\Models\LaboratoryMaterial;
use App\Models\Payment;
use App\Models\PaymentItem;
use App\Models\User;
use App\Exports\BookingRoomExport;
use App\Exports\BookingEquipmentExport;
use App\Exports\BookingMaterialExport;
use App\Exports\BookingAllExport;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;

class BookingController extends BaseController
{
    private $activeAcademicYear;
    private $currentKepalaLab;

    public function __construct()
    {
        $this->activeAcademicYear = AcademicYear::where('status', 'Active')->first();
        $this->currentKepalaLab = User::where('role', 'kepala_lab_terpadu')->first();
    }

    public function bookingExport(Request $request)
    {
        try {
            $type = $request->input('type', 'all');
            $format = $request->input('format', 'xlsx'); // xlsx, csv, xls

            $fileName = "booking_{$type}_" . date('Y-m-d_H-i-s');

            switch ($type) {
                case 'room':
                    $export = new BookingRoomExport();
                    $fileName .= '_ruangan';
                    break;
                case 'equipment':
                    $export = new BookingEquipmentExport();
                    $fileName .= '_alat';
                    break;
                case 'material':
                    $export = new BookingMaterialExport();
                    $fileName .= '_bahan';
                    break;
                default:
                    $export = new BookingAllExport();
                    $fileName .= '_semua';
                    break;
            }

            return Excel::download($export, "{$fileName}.{$format}");
        } catch (\Exception $e) {
            return $this->sendError('Failed to export booking data', [$e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $query = Booking::query();

            $query->with([
                'academicYear'
            ]);

            $user = auth()->user();
            if ($user->role !== 'admin') {
                $query->where('user_id', $user->id);
            }

            if ($request->filter_status) {
                $query->where('status', $request->filter_status);
            }

            if ($request->filter_academic_year) {
                $query->where('academic_year_id', $request->filter_academic_year);
            }

            if ($request->has('search') && strlen($request->search) > 0) {
                $searchTerm = $request->search;
                $query->where('purpose', 'LIKE', "%{$searchTerm}%");
                $query->orWhere('activity_name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            $bookings = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'data' => BookingResource::collectionRequestor($bookings)
            ];

            return $this->sendResponse($response, 'Booking Data Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking data', [$e->getMessage()], 500);
        }
    }

    public function getBookingsForVerification(Request $request)
    {
        try {
            $user = auth()->user();

            $query = Booking::query();
            $query->where('academic_year_id', $this->activeAcademicYear->id);
            $query->where('status', '<>', 'draft');

            if ($request->filter_status) {
                $query->where('status', $request->filter_status);
            }

            // Jika Laboran, filter hanya booking yang laboran_id = user id
            if ($user->role === 'laboran') {
                $query->where('laboran_id', $user->id);
            }

            // KepalaLabTerpadu can see ALL bookings, but canVerif() will control if they can verify
            // (canVerif returns 2 for paid bookings, meaning they cannot verify but can still see them)

            // Admin pengujian should only see bookings that have paid items
            if ($user->role === 'admin_pengujian') {
                $query->whereHas('equipments', function ($q) {
                    $q->where('price', '>', 0);
                })->orWhereHas('materials', function ($q) {
                    $q->where('price', '>', 0);
                })->orWhereHas('laboratoryRoom', function ($q) {
                    $q->where(function ($subQ) {
                        $subQ->where('student_price', '>', 0)
                            ->orWhere('lecturer_price', '>', 0)
                            ->orWhere('external_price', '>', 0);
                    });
                });
                // Re-apply filters after orWhereHas
                $query->where('academic_year_id', $this->activeAcademicYear->id);
                $query->where('status', '<>', 'draft');
            }

            // Eager load relations for report context
            $query->with([
                'user.studyProgram',
                'user.institution',
                'academicYear',
            ]);

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('purpose', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            $bookings = $query->paginate($perPage, ['*'], 'page', $page);
            $response = [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'data' => BookingResource::collectionWithApprovals($bookings)
            ];

            return $this->sendResponse($response, 'Booking Data Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking data', [$e->getMessage()], 500);
        }
    }

    /**
     * Verify booking (approve / reject)
     */
    public function verify(BookingVerifyRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $booking = Booking::findOrFail($id);
            if ($booking->status !== 'pending') {
                return $this->sendError('Peminjaman ini telah dilakukan verifikasi sebelumnya', [], 400);
            }

            // validasi role dan status
            $validationError = $this->validateApprovalFlow($booking, $user);
            if ($validationError) {
                return $this->sendError($validationError, [], 400);
            }

            // $isApprove: 1 = approve, 2 = revision, 0 = reject/other
            $isApprove = $request->action === 'approve' ? 1 : ($request->action === 'revision' ? 2 : 0);
            $this->assignBookingDataByRole($booking, $user, $request, $isApprove);

            $approvalAction = $user->role === 'laboran' ? 'verified_by_laboran' : 'verified_by_head';
            $this->recordApproval($booking->id, $approvalAction, $user->id, $isApprove, $request->information);

            DB::commit();
            return $this->sendResponse($booking->fresh(), 'Booking ' . ($isApprove ? 'Approved' : 'Rejected') . ' Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify booking', [$e->getMessage()], 500);
        }
    }

    public function bookingReturnVerification(BookingReturnRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $booking = Booking::findOrFail($id);
            if ($booking->status !== 'approved') {
                return $this->sendError('Verifikai pengembalian hanya bisa dilakukan jika status peminjaman disetujui', [], 400);
            }

            // validasi role dan status
            if ($user->role === 'laboran' && $booking->laboran_id !== $user->id) {
                return $this->sendError('Hanya Laboran yang bertanggung jawab yang bisa melakukan verifikasi ini', [], 400);
            }

            // $isApprove: 1 = approve, 2 = revision, 0 = reject/other
            if ($booking->is_requestor_can_return) {
                $this->recordApproval($booking->id, 'returned_by_requestor', $user->id, 1);
            }
            $this->recordApproval($booking->id, 'return_confirmed_by_laboran', $user->id, 1, $request->information);

            $booking->update(['status' => 'returned']);

            DB::commit();
            return $this->sendResponse($booking->fresh(), 'Booking Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify booking', [$e->getMessage()], 500);
        }
    }

    public function bookingReturnConfirmation(BookingReturnRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $booking = Booking::findOrFail($id);

            // Validate by booking status
            if ($booking->status !== 'approved') {
                return $this->sendError('Konfirmasi pengembalian hanya bisa dilakukan jika status peminjaman disetujui', [], 400);
            }

            // Validate if requestor/laboran has do the return confirmation
            if (!$booking->is_requestor_can_return) {
                return $this->sendError('Pengembalan alat untuk peminjaman ini telah dikonfirmasi sebelumnya', [], 400);
            }

            // Validate if the user is requestor
            if ($booking->user_id !== $user->id) {
                return $this->sendError('Hanya pemohon yang bisa melakukan konfirmasi ini', [], 400);
            }
            $this->recordApproval($booking->id, 'returned_by_requestor', $user->id, 1, $request->information);
            DB::commit();
            return $this->sendResponse($booking->fresh(), 'Booking Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify booking', [$e->getMessage()], 500);
        }
    }

    private function assignBookingDataByRole($booking, $user, $request, $isApprove)
    {
        // Booking is REJECTED
        if (! $isApprove) {
            $booking->update(['status' => 'rejected']);

            // Notify applicant about rejection
            Mail::to($booking->user->email)
                ->queue(new BookingNotificationRejected($booking->user, $booking, $request->information ?? null));

            return;
        }

        // Booking is APPROVED
        switch ($user->role) {
            case 'kepala_lab_terpadu':
            case 'admin_pengujian':
                // Assign laboran to the booking
                $booking->update(['laboran_id' => $request->laboran_id]);

                // Notify the assigned laboran
                if ($laboran = User::find($request->laboran_id)) {
                    Mail::to($laboran->email)
                        ->queue(new BookingNotificationKepalaLabApproved($laboran, $booking));
                }
                break;

            case 'laboran':
                // Update lab room if type is equipment
                if ($booking->booking_type === 'equipment') {
                    $booking->update([
                        'laboratory_room_id' => $request->laboratory_room_id,
                        'is_allowed_offsite' => $request->boolean('is_allowed_offsite')
                    ]);
                }

                // Final approval (laboran confirms everything)
                $booking->update(['status' => 'approved']);

                // Create event only if booking has NO paid items
                // For paid items, event will be created when payment is approved
                $booking->load(['equipments', 'materials', 'laboratoryRoom', 'user']);
                if (!$booking->hasPaidItems) {
                    $this->createBookingEvent($booking);
                }

                // Notify applicant that the booking is approved
                Mail::to($booking->user->email)
                    ->queue(new BookingNotificationLaboranApproved($booking->user, $booking));
                break;
        }
    }


    private function validateApprovalFlow($booking, $user): ?string
    {
        if ($user->role === 'laboran') {
            if ($booking->laboran_id !== $user->id) {
                return $this->sendError('Hanya Laboran yang bertanggung jawab yang bisa melakukan verifikasi ini', [], 400);
            }

            if (!$booking->kepala_lab_approval) {
                return 'Kepala Lab Terpadu atau Admin Pengujian harus verifikasi terlebih dahulu.';
            }
            $kepalaLabApproval = $booking->kepala_lab_approval;
            if ($kepalaLabApproval && isset($kepalaLabApproval['approved']) && $kepalaLabApproval['approved'] === false) {
                return 'Kepala Lab Terpadu atau Admin Pengujian telah menolak, Laboran tidak dapat verifikasi.';
            }
        }

        // Admin pengujian can only verify paid bookings
        if ($user->role === 'admin_pengujian') {
            if (!$booking->hasPaidItems) {
                return 'Admin Pengujian hanya dapat memverifikasi peminjaman berbayar.';
            }
        }

        // Kepala lab terpadu can only verify non-paid bookings
        if ($user->role === 'kepala_lab_terpadu') {
            if ($booking->hasPaidItems) {
                return 'Peminjaman berbayar diverifikasi oleh Admin Pengujian.';
            }
        }

        if ($user->role === 'kepala_lab_terpadu' && $booking->kepala_lab_approval) {
            return 'Kepala Lab Terpadu sudah melakukan verifikasi.';
        }

        return null; // valid
    }


    public function isStillHaveDraftBooking()
    {
        // Menampilan authenticate user
        $user = auth()->user();

        /*
        Menampilan data booking (peminjaman)
        dengan user berdasakan authenticate user
        */
        $query = Booking::where('status', 'draft');
        $query->where('user_id', $user->id);
        $booking = $query->first();

        if ($booking) {
            return $this->sendResponse(1, 'Booking Data Retrieved Successfully');
        }

        return $this->sendError('No draft', [], 404);
    }

    public function store(BookingRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = auth()->user();
            $data['user_id'] = $user->id;
            $data['academic_year_id'] = $this->activeAcademicYear->id;
            $data['supporting_file'] = $this->storeFile($request, 'supporting_file', 'berkas-pendukung');
            $data['start_time'] = $request->start_time;
            $data['end_time'] = $request->end_time;

            // Set status: pending only for 'room', draft otherwise
            $isRoom = $request->booking_type === 'room';
            if ($isRoom) {
                $data['status'] = 'pending';
                Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());
            } else {
                $data['status'] = 'draft';
            }

            // set ruangan_laboratorium_id to null when type is equipment
            $data['laboratory_room_id'] = $request->booking_type === 'equipment' ? null : $request->laboratory_room_id;

            $booking = Booking::create($data);
            if ($isRoom) {
                // Auto-approve for 'room' bookings
                $this->recordApproval($booking->id, 'request_booking', $user->id, 1);
                
                // Create payment if room has price
                $this->createBookingPayment($booking);
            }

            DB::commit();
            // Only send to supervisor if booking type is 'room'
            if ($isRoom) {
                $booking->load(['user.studyProgram', 'user.institution']);
                $this->sendToSupervisor($booking);
                return $this->sendResponse($booking, "Pengajuan peminjaman berhasil");
            }

            return $this->sendResponse($booking, "Harap lengkapi data selanjutnya untuk menyelesaikan pengajuan peminjaman");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan dalam pengajuan peminjaman', [$e->getMessage()], 500);
        }
    }

    public function getBookingData($id)
    {
        try {
            // Mendapatkan data booking (peminjaman) berdasarkan id
            $booking = Booking::with(['user.studyProgram', 'user.institution', 'laboratoryRoom', 'laboran', 'equipments.laboratoryEquipment', 'materials.laboratoryMaterial', 'payment'])->findOrFail($id);

            return $this->sendResponse(new BookingResource($booking), 'Booking Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Booking Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking', [$e->getMessage()], 500);
        }
    }

    public function getBookingApprovals($id)
    {
        try {
            $booking = Booking::with(['approvals.approver'])->findOrFail($id);
            return $this->sendResponse(BookingApprovalResource::collection($booking->approval_steps), 'Booking Approvals Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Booking Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve approvals', [$e->getMessage()], 500);
        }
    }

    public function storeBookingEquipmentMaterial(BookingEquipmentMaterialRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $booking = Booking::with(['equipments', 'materials', 'user'])->findOrFail($id);
            $user = $booking->user;

            if (!in_array($booking->status, ['draft'])) {
                DB::rollBack();
                return $this->sendError('Status booking tidak mengizinkan penambahan data.', [], 400);
            }

            $data = $request->validated();

            // 2. Prevent duplicate equipments/materials
            if ($this->hasExistingEquipmentOrMaterial($booking)) {
                DB::rollBack();
                return $this->sendError('Alat atau bahan sudah pernah ditambahkan.', [], 400);
            }

            // 3. Insert equipments with price
            $this->storeEquipments($booking->id, $data['laboratoryEquipments'], $user);

            // 4. Insert materials with price
            $this->storeMaterials($booking->id, $data['laboratoryMaterials'], $user);

            // 5. Update status and approval (any creation moves draft -> pending)
            if ($booking->status === 'draft') {
                $booking->update(['status' => 'pending']);
                Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());
            }

            $this->recordApproval($booking->id, 'request_booking', auth()->id(), 1);

            // 6. Create payment if booking has paid items
            $this->createBookingPayment($booking);

            DB::commit();
            $booking->load(['user.studyProgram', 'user.institution', 'equipments.laboratoryEquipment', 'materials.laboratoryMaterial']);
            $this->sendToSupervisor($booking);
            return $this->sendResponse($booking, 'Pengajuan peminjaman ruangan, alat & bahan berhasil diajukan');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to submit booking data', [$e->getMessage()], 500);
        }
    }

    public function storeBookingEquipment(BookingEquipmentRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $booking = Booking::with(['equipments', 'user'])->findOrFail($id);
            $user = $booking->user;

            if (!in_array($booking->status, ['draft'])) {
                DB::rollBack();
                return $this->sendError('Peminjaman sudah disubmit dan tidak mengizinkan penambahan alat.', [], 400);
            }

            if ($booking->equipments && $booking->equipments->count() > 0) {
                DB::rollBack();
                return $this->sendError('Alat sudah pernah ditambahkan.', [], 400);
            }

            $data = $request->validated();
            $this->storeEquipments($booking->id, $data['laboratoryEquipments'], $user);

            $booking->update(['status' => 'pending']);
            Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());

            $this->recordApproval($booking->id, 'request_booking', auth()->id(), 1);

            // Create payment if booking has paid items
            $this->createBookingPayment($booking);

            DB::commit();
            $booking->load(['equipments.laboratoryEquipment', 'user.studyProgram', 'user.institution']);
            $this->sendToSupervisor($booking);
            return $this->sendResponse($booking, 'Peminjaman berhasi diajukan');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Data peminjaman tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan dalam pengajuan peminjaman', [$e->getMessage()], 500);
        }
    }

    // Helper
    private function recordApproval($bookingId, $action, $approverId, $status, $information = null)
    {
        BookingApproval::create([
            'booking_id' => $bookingId,
            'action' => $action,
            'approver_id' => $approverId,
            'is_approved' => $status,
            'information' => $information
        ]);
    }

    private function hasExistingEquipmentOrMaterial($booking)
    {
        return (
            ($booking->equipments && $booking->equipments->isNotEmpty()) ||
            ($booking->materials && $booking->materials->isNotEmpty())
        );
    }

    private function storeEquipments($bookingId, array $equipments, $user)
    {
        $userPriceType = $this->getUserPriceType($user);
        
        foreach ($equipments as $equipment) {
            $labEquipment = LaboratoryEquipment::find($equipment['id']);
            $price = $this->getItemPrice($labEquipment, $userPriceType);
            
            BookingEquipment::create([
                'booking_id' => $bookingId,
                'laboratory_equipment_id' => $equipment['id'],
                'quantity' => $equipment['quantity'],
                'price' => $price
            ]);
        }
    }

    private function storeMaterials($bookingId, array $materials, $user)
    {
        $userPriceType = $this->getUserPriceType($user);
        
        foreach ($materials as $material) {
            $labMaterial = LaboratoryMaterial::find($material['id']);
            $price = $this->getItemPrice($labMaterial, $userPriceType);
            
            BookingMaterial::create([
                'booking_id' => $bookingId,
                'laboratory_material_id' => $material['id'],
                'quantity' => $material['quantity'],
                'price' => $price
            ]);
        }
    }

    /**
     * Get user price type based on their role and institution
     */
    private function getUserPriceType($user): string
    {
        // If user has study_program_id, they're internal (student or lecturer)
        if ($user->study_program_id) {
            return $user->role === 'dosen' ? 'lecturer' : 'student';
        }
        
        // External user
        return 'external';
    }

    /**
     * Get the price for an item based on user type
     */
    private function getItemPrice($item, string $userPriceType): float
    {
        if (!$item) return 0;
        
        return match ($userPriceType) {
            'student' => $item->student_price ?? 0,
            'lecturer' => $item->lecturer_price ?? 0,
            'external' => $item->external_price ?? 0,
            default => 0
        };
    }

    /**
     * Create initial payment for booking if it has paid items
     */
    private function createBookingPayment(Booking $booking)
    {
        // Reload to get fresh data with prices
        $booking->load(['user', 'laboratoryRoom', 'equipments.laboratoryEquipment', 'materials.laboratoryMaterial']);

        // Only create payment if there are paid items
        if (!$booking->hasPaidItems) {
            return;
        }

        $user = $booking->user;
        $payment = $booking->payment()->create([
            'user_id' => $user->id,
            'status' => 'draft',
            'amount' => 0
        ]);

        $totalAmount = 0;

        // Add room price if applicable
        if ($booking->room_price > 0 && $booking->laboratoryRoom) {
            PaymentItem::create([
                'payment_id' => $payment->id,
                'name' => 'Ruangan - ' . $booking->laboratoryRoom->name,
                'quantity' => 1,
                'unit' => 'ruangan',
                'price' => $booking->room_price,
            ]);
            $totalAmount += $booking->room_price;
        }

        // Add equipment prices
        foreach ($booking->equipments as $equipment) {
            if ($equipment->price > 0) {
                PaymentItem::create([
                    'payment_id' => $payment->id,
                    'name' => 'Alat - ' . $equipment->laboratoryEquipment->equipment_name,
                    'quantity' => $equipment->quantity,
                    'unit' => $equipment->laboratoryEquipment->unit ?? 'unit',
                    'price' => $equipment->price,
                ]);
                $totalAmount += ($equipment->price * $equipment->quantity);
            }
        }

        // Add material prices
        foreach ($booking->materials as $material) {
            if ($material->price > 0) {
                PaymentItem::create([
                    'payment_id' => $payment->id,
                    'name' => 'Bahan - ' . $material->laboratoryMaterial->material_name,
                    'quantity' => $material->quantity,
                    'unit' => $material->laboratoryMaterial->unit ?? 'unit',
                    'price' => $material->price,
                ]);
                $totalAmount += ($material->price * $material->quantity);
            }
        }

        $payment->update(['amount' => $totalAmount]);
    }

    /**
     * Create an event for the booking
     */
    private function createBookingEvent(Booking $booking)
    {
        // Only create event if it doesn't already exist
        if ($booking->event) {
            return;
        }

        Event::create([
            'eventable_id' => $booking->id,
            'eventable_type' => Booking::class,
            'title' => 'Peminjaman - ' . $booking->activity_name,
            'start_date' => $booking->start_time,
            'end_date' => $booking->end_time,
        ]);
    }

    private function sendToSupervisor($booking)
    {
        if (!empty($booking->supervisor_email)) {
            Mail::to($booking->supervisor_email)->queue(new BookingNotificationSupervisor($booking));
        }
    }
}
