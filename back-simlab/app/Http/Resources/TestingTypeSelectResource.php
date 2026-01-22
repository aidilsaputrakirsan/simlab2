<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestingTypeSelectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $role = $request->user()->role;

        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'unit'  => $this->unit,
            'price' => $this->priceForRole($role)
        ];
    }
}
