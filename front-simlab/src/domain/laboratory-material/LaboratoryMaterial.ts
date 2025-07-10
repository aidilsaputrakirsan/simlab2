import { LaboratoryRoom } from "../laboratory-room/LaboratoryRoom";

export class LaboratoryMaterial {
    constructor(
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
        readonly laboratoryRoom?: LaboratoryRoom
    ) { }
}