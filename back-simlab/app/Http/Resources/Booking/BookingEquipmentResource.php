<?php

namespace App\Http\Resources\Booking;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingEquipmentResource extends JsonResource
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
            'laboratory_equipment_id' => $this->laboratory_equipment_id,
            'equipment_name' => $this->whenLoaded('laboratoryEquipment', function () {
                return $this->laboratoryEquipment->equipment_name;
            }),
            'unit' => $this->whenLoaded('laboratoryEquipment', function () {
                return $this->laboratoryEquipment->unit;
            }),
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->price * $this->quantity
        ];
    }
}
