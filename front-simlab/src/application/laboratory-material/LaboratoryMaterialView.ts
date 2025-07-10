import { LaboratoryMaterial } from "@/domain/laboratory-material/LaboratoryMaterial";
import { LaboratoryRoomView } from "../laboratory-room/LaboratoryRoomView";

export class LaboratoryMaterialView {
    private constructor(
        readonly id: number,
        readonly code: string,
        readonly laboratoryRoomId: number,
        readonly materialName: string,
        readonly brand: string,
        readonly stock: number,
        readonly unit: string,
        readonly purchaseDate: Date,
        readonly expiryDate: Date,
        readonly description: string,
        readonly refillDate: Date,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly laboratoryRoom?: LaboratoryRoomView
    ) { }

    static fromDomain(entity: LaboratoryMaterial): LaboratoryMaterialView {
        return new LaboratoryMaterial(
            entity.id,
            entity.code,
            entity.laboratoryRoomId,
            entity.materialName,
            entity.brand,
            entity.stock,
            entity.unit,
            entity.purchaseDate,
            entity.expiryDate,
            entity.description,
            entity.refillDate,
            entity.createdAt,
            entity.updatedAt,
            entity.laboratoryRoom ? LaboratoryRoomView.fromDomain(entity.laboratoryRoom) : undefined
        )
    }
}