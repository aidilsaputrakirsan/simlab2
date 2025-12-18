<?php

namespace App\Http\Resources\TestingRequest;

use App\Http\Resources\TestingRequestItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestingRequestResource extends JsonResource
{

    protected static $approvals = false;

    public static function collectionWithApproval($resource)
    {
        static::$approvals = true;
        return parent::collection($resource);
    }


    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'academic_year' => $this->whenLoaded('academicYear', function () {
                return $this->academicYear->name;
            }),
            'requestor' => $this->whenLoaded('requestor', function () {
                return [
                    'name' => $this->requestor->name,
                    'email' => $this->requestor->email,
                ];
            }),
            'laboran' => $this->whenLoaded('laboran', function () {
                return [
                    'name' => $this->laboran->name,
                    'email' => $this->laboran->email,
                ];
            }),
            'testing_request_items' => TestingRequestItemResource::collection($this->whenLoaded('testRequestItems')),
            'phone_number' => $this->phone_number,
            'activity_name' => $this->activity_name,
            'supervisor' => $this->supervisor,
            'supervisor_email' => $this->supervisor_email,
            'testing_time' => $this->convertToISO('testing_time'),
            'status' => $this->status,
            'information' => $this->information,
            'result_file' => $this->result_file,
            'created_at' => $this->convertToISO('created_at'),
            'updated_at' => $this->convertToISO('updated_at'),
            'has_paid_items' => $this->hasPaidItems,
            'payment_status' => $this->whenLoaded('payment', function () {
                return $this->payment->status;
            }),
            $this->mergeWhen(static::$approvals, function () {
                return ['canVerif' => $this->canVerif(auth()->user())];
            }),
        ];
    }
}
