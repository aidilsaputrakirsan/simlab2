<?php

namespace App\Http\Resources\PracticumScheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticumSchedulingMaterialResource extends JsonResource
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
            // Ambil langsung dari relasi (null-safe) agar nama tetap tampil walau
            // relasi tidak di-eager-load, dan tidak error bila bahan sudah dihapus.
            'material_name' => $this->laboratoryMaterial?->material_name,
            'unit' => $this->laboratoryMaterial?->unit,
            'quantity' => $this->quantity,
            'realization' => $this->realization,
        ];
    }
}
