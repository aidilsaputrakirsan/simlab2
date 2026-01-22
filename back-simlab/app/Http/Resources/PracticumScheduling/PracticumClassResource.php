<?php

namespace App\Http\Resources\PracticumScheduling;

use App\Http\Resources\PracticumScheduling\PracticumSessionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticumClassResource extends JsonResource
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
            'name' => $this->name,
            'practicum_assistant' => $this->practicum_assistant,
            'total_participant' => $this->total_participant,
            'total_group' => $this->total_group,
            'laboratory_room_name' => $this->whenLoaded('laboratoryRoom', function () {
                return $this->laboratoryRoom->name;
            }),
            'lecturer' => $this->whenLoaded('lecturer', function () {
                return [
                    'name' => $this->lecturer->name,
                    'email' => $this->lecturer->email,
                    'identity_num' => $this->lecturer->identityNum
                ];
            }),
            'practicum_sessions' => $this->whenLoaded('practicumSessions', function () {
                return PracticumSessionResource::collection($this->practicumSessions);
            }),
            'created_at' => $this->convertToISO('created_at'),
            'updated_at' => $this->convertToISO('updated_at'),
        ];
    }
}
