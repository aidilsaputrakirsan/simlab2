import { LaboratoryEquipment } from "@/domain/laboratory-equipment/LaboratoryEquipment";
import { LaboratoryRoomView } from "../laboratory-room/LaboratoryRoomView";

export class LaboratoryEquipmentView {
    private constructor(
        readonly id: number,
        readonly equipmentName: string,
        readonly ruanganLaboratoriumId: number,
        readonly quantity: number,
        readonly unit: string,
        readonly equipmentFunction: string,
        readonly photo: string,
        readonly brand: string,
        readonly equipmentType: string,
        readonly origin: string,
        readonly condition: string,
        readonly conditionDescription: string,
        readonly assetCode: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly ruanganLaboratorium?: LaboratoryRoomView
    ){}

    static fromDomain(entity: LaboratoryEquipment): LaboratoryEquipmentView {
        return new LaboratoryEquipmentView(
            entity.id,
            entity.equipmentName,
            entity.ruanganLaboratoriumId,
            entity.quantity,
            entity.unit,
            entity.equipmentFunction,
            entity.photo,
            entity.brand,
            entity.equipmentType,
            entity.origin,
            entity.condition,
            entity.conditionDescription,
            entity.assetCode,
            entity.createdAt,
            entity.updatedAt,
            entity.ruanganLaboratorium ? LaboratoryRoomView.fromDomain(entity.ruanganLaboratorium) : undefined
        )
    }
}