import { MajorInputDTO, MajorTableParam } from "../../application/dto/MajorDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { Major } from "./Major"

export interface IMajorReporsitory {
    getAll(params: MajorTableParam): Promise<PaginatedResponse<Major>>
    createData(data: MajorInputDTO): Promise<ApiResponse>
    updateData(id: number, data: MajorInputDTO): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}