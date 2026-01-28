<?php

namespace App\Http\Resources\Booking;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingMaterialResource extends JsonResource
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
            'laboratory_material_id' => $this->laboratory_material_id,
            'material_name' => $this->whenLoaded('laboratoryMaterial', function () {
                return $this->laboratoryMaterial->material_name;
            }),
            'unit' => $this->whenLoaded('laboratoryMaterial', function () {
                return $this->laboratoryMaterial->unit;
            }),
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->price * $this->quantity
        ];
    }
}
