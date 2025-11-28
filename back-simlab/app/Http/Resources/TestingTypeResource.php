<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestingTypeResource extends JsonResource
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
            'unit' => $this->unit,
            'student_price' => $this->student_price,
            'lecturer_price' => $this->lecturer_price,
            'external_price' => $this->external_price,
            'testing_category' => $this->whenLoaded('testingCategory', function () {
                return [
                    'id' => $this->testingCategory->id,
                    'name' => $this->testingCategory->name
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
