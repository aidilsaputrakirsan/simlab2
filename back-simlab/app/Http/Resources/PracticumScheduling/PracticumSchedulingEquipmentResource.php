<?php

namespace App\Http\Resources\PracticumScheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticumSchedulingEquipmentResource extends JsonResource
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
            'practicum_scheduling_id' => $this->practicum_scheduling_id,
            'quantity' => $this->quantity,
            'equipmentable_id' => $this->equipmentable_id,
            'equipmentable_type' => $this->equipmentable_type,
            'equipmentable' => $this->whenLoaded('equipmentable', function () {
                return [
                    'id' => $this->equipmentable->id,
                    'name' => $this->equipmentable->name ?? null,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
