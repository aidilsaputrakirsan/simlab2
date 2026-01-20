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
            'payment_number' => $this->payment_number,
            'amount' => $this->amount,
            'invoice_file' => $this->invoice_file,
            'payment_proof' => $this->payment_proof,
            'va_number' => $this->va_number,
            'status' => $this->status,
            'payment_type' => $this->getPaymentType(),
            'payment_category' => $this->getPaymentCategory(),
            'payable_id' => $this->payable_id,
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
            'App\\Models\\Booking' => 'Peminjaman Peralatan',
            'App\\Models\\TestingRequest' => 'Pengujian',
        ];

        return $paymentTypes[$this->payable_type] ?? 'Pembayaran Lainnya';
    }
}
