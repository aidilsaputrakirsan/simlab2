import { LaboratoryEquipment } from "../../domain/laboratory-equipment/LaboratoryEquipment";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";

export type LaboratoryEquipmentAPI = {
    id: number;
    equipment_name: string;
    ruangan_laboratorium_id: number;
    quantity: number;
    unit: string;
    function: string;
    photo: string;
    brand: string;
    equipment_type: string;
    origin: string;
    condition: string;
    condition_description: string;
    asset_code: string
    created_at: Date | null;
    updated_at: Date | null;
    ruangan_laboratorium?: LaboratoryRoomAPI
}

export function toDomain(api: LaboratoryEquipmentAPI): LaboratoryEquipment {
    return new LaboratoryEquipment(
        api.id,
        api.equipment_name,
        api.ruangan_laboratorium_id,
        api.quantity,
        api.unit,
        api.function,
        api.photo,
        api.brand,
        api.equipment_type,
        api.origin,
        api.condition,
        api.condition_description,
        api.asset_code,
        api.created_at,
        api.updated_at,
        api.ruangan_laboratorium ? toLaboratoryRoom(api.ruangan_laboratorium) : undefined
    );
}