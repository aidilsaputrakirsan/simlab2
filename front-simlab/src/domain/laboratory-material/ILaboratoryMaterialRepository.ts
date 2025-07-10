import { LaboratoryMaterialInputDTO, LaboratoryMaterialTableParams } from "@/application/laboratory-material/dto/LaboratoryMaterialDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { LaboratoryMaterial } from "./LaboratoryMaterial"

export interface ILaboratoryMaterialRepository {
    getAll(params: LaboratoryMaterialTableParams): Promise<PaginatedResponse<LaboratoryMaterial>>
    createData(data: LaboratoryMaterialInputDTO): Promise<ApiResponse>
    updateData(id: number, data: LaboratoryMaterialInputDTO): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}