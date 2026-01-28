<?php

namespace App\Http\Resources\PracticumScheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticumSessionResource extends JsonResource
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
            'start_time' => $this->convertToISO('start_time'),
            'end_time' => $this->convertToISO('end_time'),
            'is_class_conducted' => $this->is_class_conducted,
            'laboran_comment' => $this->laboran_comment,
            'laboran_commented_at' => $this->convertToISO('laboran_commented_at'),
            'lecturer_comment' => $this->lecturer_comment,
            'lecturer_commented_at' => $this->convertToISO('lecturer_commented_at'),
            'practicum_module_id' => $this->practicum_module_id,
            'practicum_module' => $this->whenLoaded('practicumModule', function () {
                return $this->practicumModule->name;
            }),
        ];
    }
}
