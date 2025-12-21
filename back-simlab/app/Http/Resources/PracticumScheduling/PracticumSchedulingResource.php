<?php

namespace App\Http\Resources\PracticumScheduling;

use App\Http\Resources\RequestorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticumSchedulingResource extends JsonResource
{
    protected static $approvals = false;

    public static function collectionWithApproval($resource)
    {
        static::$approvals = true;
        return parent::collection($resource);
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'academic_year' => $this->whenLoaded('academicYear', function () {
                return $this->academicYear->name;
            }),
            'practicum_name' => $this->whenLoaded('practicum', function () {
                return $this->practicum->name;
            }),
            'phone_number' => $this->phone_number,
            'requestor' => $this->whenLoaded('user', function () {
                return new RequestorResource($this->user);
            }),
            'laboran' => $this->whenLoaded('laboran', function () {
                return [
                    'name' => $this->laboran->name,
                    'email' => $this->laboran->email,
                ];
            }),
            'status' => $this->status,
            'created_at' => $this->convertToISO('created_at'),
            'updated_at' => $this->convertToISO('updated_at'),
            $this->mergeWhen(static::$approvals, function () {
                return ['canVerif' => $this->canVerif(auth()->user())];
            }),
            'practicum_classes' => $this->whenLoaded('practicumClasses', function () {
                return PracticumClassResource::collection($this->practicumClasses);
            }),
            'practicum_scheduling_equipments' => $this->whenLoaded('practicumSchedulingEquipments', function () {
                return $this->practicumSchedulingEquipments->map(function ($equipment) {
                    $practicumEquipment = [
                        'id' => $equipment->id,
                        'practicum_scheduling_id' => $equipment->practicum_scheduling_id,
                        'quantity' => $equipment->quantity,
                        'created_at' => optional($equipment->created_at)->toIso8601String(),
                        'updated_at' => optional($equipment->updated_at)->toIso8601String(),
                    ];

                    if ($equipment->relationLoaded('equipmentable') && $equipment->equipmentable) {
                        $type = class_basename($equipment->equipmentable_type);

                        switch ($type) {
                            case 'LaboratoryEquipment':
                                $practicumEquipment['name'] = $equipment->equipmentable->equipment_name;
                                $practicumEquipment['unit'] = $equipment->equipmentable->unit ?? null;
                                $practicumEquipment['type'] = 'laboratory_equipment';
                                break;

                            case 'LaboratoryTemporaryEquipment':
                                $practicumEquipment['name'] = $equipment->equipmentable->name;
                                $practicumEquipment['unit'] = null;
                                $practicumEquipment['type'] = 'laboratory_temporary_equipment';
                                break;
                        }
                    }

                    return $practicumEquipment;
                });
            }),
            'practicum_scheduling_materials' => $this->whenLoaded('practicumSchedulingMaterials', function () {
                return PracticumSchedulingMaterialResource::collection($this->practicumSchedulingMaterials);
            }),
        ];
    }
}
