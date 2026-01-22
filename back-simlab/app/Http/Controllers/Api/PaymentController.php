<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PaymentCreateRequest;
use App\Http\Requests\PaymentProofRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Expr\FuncCall;

class PaymentController extends BaseController
{
    public function createPayment(PaymentCreateRequest $request, $id)
    {
        try {
            $payment = Payment::findOrFail($id);
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
            $payment_proof = $this->storeFile($request, 'payment_proof', 'invoice');

            if ($payment->user_id !== auth()->user()->id) {
                return $this->sendError('Tidak diizinkan mengunggah bukti pembayaran ini', [], 403);
            }

            $payment->update([
                'payment_proof' => $payment_proof,
            ]);
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
            $payment = Payment::findOrFail($id);
            $payment->update(['status' => $request->action]);

            return $this->sendResponse([], 'Berhasil mengupload bukti pembayaran');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Data Pembayaran tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengupload bukti pembayaran', [$e->getMessage()], 500);
        }
    }
}
