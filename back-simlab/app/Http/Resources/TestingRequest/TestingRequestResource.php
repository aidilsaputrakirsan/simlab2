<?php

namespace App\Http\Resources\TestingRequest;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestingRequestResource extends JsonResource
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
            'academic_year' => $this->whenLoaded('academicYear', function () {
                return $this->academicYear->name;
            }),
            'requestor' => $this->whenLoaded('requestor', function() {
                return [
                    'name' => $this->requestor->name,
                    'email' => $this->requestor->email,
                ];
            }),
            'laboran' => $this->whenLoaded('laboran', function() {
                return [
                    'name' => $this->laboran->name,
                    'email' => $this->laboran->email,
                ];
            }),
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
        ];
    }
}
