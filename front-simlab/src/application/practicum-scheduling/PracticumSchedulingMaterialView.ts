import { PracticumSchedulingMaterial } from "@/domain/practicum-scheduling/PracticumSchedulingMaterial";

export class PracticumSchedulingMaterialView {
    constructor(
        readonly id: number,
        readonly materialName: string,
        readonly unit: string,
        readonly quantity: number,
        readonly realization: number,
    ) { }

    static fromDomain(entity: PracticumSchedulingMaterial): PracticumSchedulingMaterialView {
        return new PracticumSchedulingMaterialView(
            entity.id,
            entity.materialName,
            entity.unit,
            entity.quantity,
            entity.realization,
        )
    }
}