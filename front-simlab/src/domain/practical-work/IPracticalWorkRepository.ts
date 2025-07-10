import { PracticalWorkTableParam } from "@/application/practical-work/dto/PracticalWorkDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { PracticalWork } from "./PracticalWork"

export interface IPracticalWorkRepository {
    getAll(params: PracticalWorkTableParam): Promise<PaginatedResponse<PracticalWork>>
    createData(data: Record<string, any>): Promise<ApiResponse<PracticalWork>>
    updateData(id: number, data: Record<string, any>): Promise<ApiResponse<PracticalWork>>
    deleteData(id: number): Promise<ApiResponse>
}