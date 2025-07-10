import { LaboratoryRoom } from "../laboratory-room/LaboratoryRoom";

export class LaboratoryEquipment {
    constructor(
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
        readonly ruanganLaboratorium?: LaboratoryRoom
    ) {}
}