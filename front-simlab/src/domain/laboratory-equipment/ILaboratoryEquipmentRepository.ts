import { LaboratoryEquipmentInputDTO, LaboratoryEquipmentTableParams } from "@/application/laboratory-equipment/dto/LaboratoryEquipmentDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { LaboratoryEquipment } from "./LaboratoryEquipment"

export interface ILaboratoryEquipmentRepository {
    getAll(params: LaboratoryEquipmentTableParams): Promise<PaginatedResponse<LaboratoryEquipment>>
    createData(data: LaboratoryEquipmentInputDTO): Promise<ApiResponse>
    updateData(id: number, data: LaboratoryEquipmentInputDTO): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}