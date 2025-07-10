import { LaboratoryRoomInputDTO, LaboratoryRoomParam } from "@/application/laboratory-room/dto/LaboratoryRoomDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { LaboratoryRoom } from "./LaboratoryRoom"

export interface ILaboratoryRoomRepository {
    getAll(params: LaboratoryRoomParam): Promise<PaginatedResponse<LaboratoryRoom>>
    createData(data: LaboratoryRoomInputDTO): Promise<ApiResponse<LaboratoryRoom>>
    updateData(id: number, data: LaboratoryRoomInputDTO): Promise<ApiResponse<LaboratoryRoom>>
    deleteData(id: number): Promise<ApiResponse>
}