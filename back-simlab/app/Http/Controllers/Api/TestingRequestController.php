<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestingRequestInputRequest;
use App\Http\Requests\TestingRequestVerifyRequest;
use App\Http\Resources\TestingRequest\TestingRequestResource;
use App\Models\AcademicYear;
use App\Models\PaymentItem;
use App\Models\TestingRequest;
use App\Models\TestingRequestApproval;
use App\Models\TestingRequestItem;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestingRequestController extends BaseController
{
    private $activeAcademicYear;
    public function __construct()
    {
        $this->activeAcademicYear = AcademicYear::where('status', 'Active')->first();
    }

    public function index(Request $request)
    {
        try {
            $query = TestingRequest::query();
            $query->with([
                'academicYear',
                'payment'
            ]);
            $user = auth()->user();

            $query->where('requestor_id', $user->id);

            if ($request->filter_status) {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && strlen($request->search) > 0) {
                $searchTerm = $request->search;
                $query->where('activity_name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            $testRequests = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $testRequests->currentPage(),
                'last_page' => $testRequests->lastPage(),
                'per_page' => $testRequests->perPage(),
                'total' => $testRequests->total(),
                'data' => TestingRequestResource::collection($testRequests)
            ];

            return $this->sendResponse($response, 'Berhasil mengambil data pengujian');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data pengujian', [$e->getMessage()]);
        }
    }

    public function getTestingRequestForVerification(Request $request)
    {
        try {
            $query = TestingRequest::query();
            $query->with([
                'academicYear',
                'payment',
                'testRequestItems'
            ]);

            $query->where('academic_year_id', $this->activeAcademicYear->id);
            $query->where('status', '<>', 'draft');

            // Jika Laboran, filter hanya booking yang laboran_id = user id
            $user = auth()->user();
            if ($user->role === 'admin_keuangan') {
                // Admin keuangan should only see testing requests that have payment records
                $query->whereHas('payment');
            }

            if ($user->role === 'admin_pengujian') {
                // Admin pengujian should only see testing requests that have paid items
                $query->whereHas('testRequestItems', function ($q) {
                    $q->where('price', '>', 0);
                });
            }

            if ($user->role === 'laboran') {
                $query->where('laboran_id', $user->id);
            }

            if ($request->filter_status) {
                $query->where('status', $request->filter_status);
            }

            if ($request->has('search') && strlen($request->search) > 0) {
                $searchTerm = $request->search;
                $query->where('activity_name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            $testRequests = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $testRequests->currentPage(),
                'last_page' => $testRequests->lastPage(),
                'per_page' => $testRequests->perPage(),
                'total' => $testRequests->total(),
                'data' => TestingRequestResource::collectionWithApproval($testRequests)
            ];

            return $this->sendResponse($response, 'Berhasil mengambil data pengujian');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data pengujian', [$e->getMessage()]);
        }
    }

    public function store(TestingRequestInputRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = auth()->user();
            $data['requestor_id'] = $user->id;
            $data['academic_year_id'] = $this->activeAcademicYear->id;
            $data['status'] = 'pending';

            $testingRequest = TestingRequest::create($data);
            $testingRequestId = $testingRequest->id;

            // Store testing items
            $this->storeTestingItems($testingRequestId, $data['testing_items']);

            $hasPaidItems = collect($data['testing_items'])
                ->contains(fn($item) => $item['price'] > 0);

            // make the draft payment
            if ($hasPaidItems) {
                $this->assignInitialPayment($testingRequest, $user, $data['testing_items']);
            }

            // recort the requestor approval
            $this->recordApproval($testingRequestId, 'request_testing', $user->id, 1);

            DB::commit();
            return $this->sendResponse($testingRequest, 'Pengajuan pengujian berhasil');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan dalam pengajuan pengujian', [$e->getMessage()], 500);
        }
    }

    public function verify(TestingRequestVerifyRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $testingRequest = TestingRequest::findOrFail($id);
            if ($testingRequest->status !== 'pending') {
                return $this->sendError('Pengajuan pengujian ini telah dilakukan verifikasi sebelumnya', [], 400);
            }

            if ($user->role === 'laboran') {
                if ($testingRequest->laboran_id !== $user->id) {
                    return $this->sendError('Hanya Laboran yang bertanggung jawab yang bisa melakukan verifikasi ini', [], 400);
                }
            }

            // Admin pengujian can only verify paid testing requests
            if ($user->role === 'admin_pengujian' && !$testingRequest->hasPaidItems) {
                return $this->sendError('Admin Pengujian hanya dapat memverifikasi pengajuan pengujian berbayar', [], 400);
            }

            // Kepala lab terpadu can only verify non-paid testing requests
            if ($user->role === 'kepala_lab_terpadu' && $testingRequest->hasPaidItems) {
                return $this->sendError('Pengajuan pengujian berbayar diverifikasi oleh Admin Pengujian', [], 400);
            }

            if ($testingRequest->canVerif($user) !== 1) {
                return $this->sendError('Anda tidak diizinkan untuk melakukan verifikasi', [], 400);
            }

            $isApprove = $request->action === 'approve' ? 1 : ($request->action === 'revision' ? 2 : 0);
            $this->assignTestingRequestDataByRole($testingRequest, $user, $request, $isApprove);

            $approvalAction = $this->getApprovalActionByRole($user->role, $testingRequest->hasPaidItems);
            $this->recordApproval($testingRequest->id, $approvalAction, $user->id, $isApprove, $request->information);

            DB::commit();
            return $this->sendResponse([], 'Berhasil melakukan verifikasi pengajuan pengujian');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Data pengujian tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan dalam verifikasi pengujian', [$e->getMessage()], 500);
        }
    }

    private function getApprovalActionByRole($role, $hasPaidItems)
    {
        switch ($role) {
            case 'admin_pengujian':
            case 'kepala_lab_terpadu':
                return 'verified_by_head';
            case 'laboran':
                return 'verified_by_laboran';
            default:
                return null;
        }
    }

    public function getTestingRequestData($id)
    {
        try {
            $testingRequest = TestingRequest::with(['requestor.studyProgram', 'requestor.institution', 'laboran', 'academicYear', 'testRequestItems.testingType', 'payment'])->findOrFail($id);

            return $this->sendResponse(new TestingRequestResource($testingRequest), 'Berhasil mengambil data pengujian');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data pengujian', [$e->getMessage()]);
        }
    }

    public function getTestingRequestApproval($id)
    {
        try {
            $testingRequest = TestingRequest::with(['testRequestApprovals.approver'])->findOrFail($id);
            return $this->sendResponse($testingRequest->approval_steps, 'Berhasil mengambil data pengujian');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengambil data pengujian', [$e->getMessage()]);
        }
    }

    private function assignInitialPayment($testingRequest, $user, array $testingRequestItems)
    {
        $payment = $testingRequest->payment()->create([
            'user_id' => $user->id,
            'status' => 'draft'
        ]);

        $totalAmount = 0;
        foreach ($testingRequestItems as $item) {
            $totalAmount += ($item['quantity'] * $item['price']);
            PaymentItem::create([
                'payment_id' => $payment->id,
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'unit' => $item['unit'],
                'price' => $item['price'],
            ]);
        }
        $payment->update(['amount' => $totalAmount]);
    }

    private function assignTestingRequestDataByRole($testingRequest, $user, $request, $isApprove)
    {
        // is REJECTED
        if (!$isApprove) {
            $testingRequest->update(['status' => 'rejected']);

            // Notify applicant about rejection

            return;
        }

        // is APPROVED
        switch ($user->role) {
            case 'kepala_lab_terpadu':
            case 'admin_pengujian':
                // Assign laboran
                $testingRequest->update(['laboran_id' => $request->laboran_id]);

                // Notify the assigned laboran
                break;

            case 'laboran':

                // Final approval (laboran confirms everything)
                $testingRequest->update(['status' => 'approved']);

                // Notify applicant
                break;
        }
    }

    // Helper
    private function recordApproval($testingRequestId, $action, $approverId, $status, $information = null)
    {
        TestingRequestApproval::create([
            'testing_request_id' => $testingRequestId,
            'action' => $action,
            'approver_id' => $approverId,
            'is_approved' => $status,
            'information' => $information
        ]);
    }

    private function storeTestingItems($testingRequestId, array $testingRequestItems)
    {
        foreach ($testingRequestItems as $item) {
            TestingRequestItem::create([
                'testing_request_id' => $testingRequestId,
                'testing_type_id' => $item['testing_type_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }
    }
}
