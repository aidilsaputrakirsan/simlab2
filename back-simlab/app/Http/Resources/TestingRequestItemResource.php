<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestingRequestItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->whenLoaded('testingType', function() {
                return $this->testingType->name;
            }),
            'unit' => $this->whenLoaded('testingType', function () {
                return $this->testingType->unit;
            }),
            'quantity' => $this->quantity,
        ];
    }
}
