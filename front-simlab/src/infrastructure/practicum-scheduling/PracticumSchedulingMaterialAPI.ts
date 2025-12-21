import { PracticumSchedulingMaterial } from "@/domain/practicum-scheduling/PracticumSchedulingMaterial";

export type PracticumSchedulingMaterialAPI = {
    id: number;
    material_name: string;
    unit: string;
    quantity: number;
    realization: number;
}

export function toDomain(api: PracticumSchedulingMaterialAPI): PracticumSchedulingMaterial {
    return new PracticumSchedulingMaterial(
        api.id,
        api.material_name,
        api.unit,
        api.quantity,
        api.realization,
    )
}