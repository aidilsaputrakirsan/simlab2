<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PaymentCreateRequest;
use App\Http\Requests\PaymentProofRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Booking;
use App\Models\Event;
use App\Models\Payment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Expr\FuncCall;

class PaymentController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            $query = Payment::query()->with(['user', 'payable']);

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->orWhere('payment_number', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('va_number', 'LIKE', "%{$searchTerm}%")
                      ->orWhereHas('user', function ($userQ) use ($searchTerm) {
                          $userQ->where('name', 'LIKE', "%{$searchTerm}%");
                      });
                });
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            // Execute pagination
            $payments = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
                'data' => PaymentResource::collection($payments)
            ];

            return $this->sendResponse($response, 'Data pembayaran berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data pembayaran', [$e->getMessage()], 500);
        }
    }

    public function createPayment(PaymentCreateRequest $request, $id)
    {
        try {
            $payment = Payment::with('payable')->findOrFail($id);

            // Validate that the related testing request is approved
            if ($payment->payable && $payment->payable->status !== 'approved') {
                return $this->sendError('Tidak dapat menerbitkan pembayaran sebelum pengajuan pengujian disetujui', [], 400);
            }

            $data = $request->validated();
            $data['invoice_file'] = $this->storeFile($request, 'invoice_file', 'invoice');

            $payment->update([
                'payment_number' => $data['payment_number'],
                'va_number' => $data['va_number'],
                'invoice_file' => $data['invoice_file'],
                'status' => 'pending'
            ]);
            return $this->sendResponse([], 'Berhasil membuat pembayaran', 201);
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data Pembayaran tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika membuat pembayaran', [$e->getMessage()], 500);
        }
    }

    public function storePaymentProof(PaymentProofRequest $request, $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            if ($payment->user_id !== auth()->user()->id) {
                return $this->sendError('Tidak diizinkan mengunggah bukti pembayaran ini', [], 403);
            }

            // Only allow re-upload if payment is rejected or pending without proof yet
            if ($payment->status === 'approved') {
                return $this->sendError('Pembayaran sudah disetujui, tidak dapat mengubah bukti pembayaran', [], 400);
            }

            // Delete previous payment proof if exists before uploading new one
            $payment_proof = $this->storeFile($request, 'payment_proof', 'invoice', $payment->payment_proof);

            // If payment was rejected, reset status to pending for re-review
            $updateData = ['payment_proof' => $payment_proof];
            if ($payment->status === 'rejected') {
                $updateData['status'] = 'pending';
            }

            $payment->update($updateData);
            return $this->sendResponse([], 'Berhasil mengupload bukti pembayaran');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data Pembayaran tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengupload bukti pembayaran', [$e->getMessage()], 500);
        }
    }

    public function getPaymentData($id)
    {
        try {
            $payment = Payment::findOrFail($id);

            return $this->sendResponse(new PaymentResource($payment), 'Berhasil mengupload bukti pembayaran');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data Pembayaran tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengupload bukti pembayaran', [$e->getMessage()], 500);
        }
    }

    public function verif(Request $request, $id)
    {
        try {
            $payment = Payment::with('payable')->findOrFail($id);
            $payment->update(['status' => $request->action]);

            // If payment is approved and the payable is a Booking, create the event
            if ($request->action === 'approved' && $payment->payable instanceof Booking) {
                $booking = $payment->payable;
                
                // Only create event if it doesn't already exist
                if (!$booking->event) {
                    Event::create([
                        'eventable_id' => $booking->id,
                        'eventable_type' => Booking::class,
                        'title' => 'Peminjaman - ' . $booking->activity_name,
                        'start_date' => $booking->start_time,
                        'end_date' => $booking->end_time,
                    ]);
                }
            }

            return $this->sendResponse([], 'Berhasil memverifikasi pembayaran');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data Pembayaran tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika memverifikasi pembayaran', [$e->getMessage()], 500);
        }
    }
}
