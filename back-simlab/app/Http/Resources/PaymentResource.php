<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'payment_number' => $this->payment_number,
            'amount' => $this->amount,
            'invoice_file' => $this->invoice_file,
            'payment_proof' => $this->payment_proof,
            'receipt_file' => $this->receipt_file,
            'va_number' => $this->va_number,
            'status' => $this->status,
            'payment_type' => $this->getPaymentType(),
            'payment_category' => $this->getPaymentCategory(),
            'payable_id' => $this->payable_id,
            'payable_status' => $this->whenLoaded('payable', function () {
                return $this->payable->status ?? null;
            }),
            'can_verif' => $this->whenLoaded('payable', function () {
                $user = auth()->user();
                if ($this->payable && method_exists($this->payable, 'canVerif')) {
                    return $this->payable->canVerif($user);
                }
                return null;
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'study_program' => $this->user->studyProgram->name ?? null,
                    'institution' => $this->user->institution ?? null,
                ];
            }),
        ];
    }

    private function getPaymentCategory()
    {
        $categories = [
            'App\\Models\\Booking' => 'booking',
            'App\\Models\\TestingRequest' => 'testing_request',
        ];

        return $categories[$this->payable_type] ?? 'other';
    }

    private function getPaymentType()
    {
        $paymentTypes = [
            'App\\Models\\Booking' => 'Penyewaan',
            'App\\Models\\TestingRequest' => 'Pengujian',
        ];

        return $paymentTypes[$this->payable_type] ?? 'Pembayaran Lainnya';
    }
}
