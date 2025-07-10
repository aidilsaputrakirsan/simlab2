import { LaboratoryMaterial } from "../../domain/laboratory-material/LaboratoryMaterial";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";

export type LaboratoryMaterialAPI = {
    id: number;
    code: string;
    ruangan_laboratorium_id: number;
    material_name: string;
    brand: string;
    stock: number;
    unit: string;
    purchase_date: Date;
    expiry_date: Date;
    description: string;
    refill_date: Date;
    created_at: Date | null;
    updated_at: Date | null;
    ruangan_laboratorium: LaboratoryRoomAPI
}

export function toDomain(api: LaboratoryMaterialAPI): LaboratoryMaterial {
    return new LaboratoryMaterial(
        api.id,
        api.code,
        api.ruangan_laboratorium_id,
        api.material_name,
        api.brand,
        api.stock,
        api.unit,
        api.purchase_date,
        api.expiry_date,
        api.description,
        api.refill_date,
        api.created_at,
        api.updated_at,
        api.ruangan_laboratorium ? toLaboratoryRoom(api.ruangan_laboratorium) : undefined
    );
}