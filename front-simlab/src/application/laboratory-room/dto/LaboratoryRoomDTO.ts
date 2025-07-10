export interface LaboratoryRoomInputDTO {
    name: string,
    floor: string,
    user_id: number | null,
}

export interface LaboratoryRoomParam {
    page: number,
    per_page: number,
    search: string,
}