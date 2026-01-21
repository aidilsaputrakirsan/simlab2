import { LaboratoryRoomSelect } from "@/domain/laboratory-room/LaboratoryRoomSelect"

export type LaboratoryRoomSelectAPI = {
    id: number,
    name: string,
    student_price: number,
    lecturer_price: number,
    external_price: number,
}

export function toDomain(api: LaboratoryRoomSelectAPI): LaboratoryRoomSelect {
    return new LaboratoryRoomSelect(
        api.id,
        api.name,
        api.student_price,
        api.lecturer_price,
        api.external_price,
    )
}