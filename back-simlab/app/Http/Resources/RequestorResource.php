<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'identity_num' => $this->identity_num,
            'is_mahasiswa' => $this->role === 'mahasiswa' ? true : false,
            'study_program' => $this->whenLoaded('studyProgram', function() {
                return $this->studyProgram->name;
            }),
            'institution' => $this->whenLoaded('institution', function() {
                return $this->institution->name;
            })
        ];
    }
}
