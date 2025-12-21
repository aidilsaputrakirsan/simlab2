import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types"
import { Institution } from "./Institution"
import { InstitutionSelect } from "./InstitutionSelect"

export interface IInstitutionRepository {
    getAll(params: { page: number, per_page: number, search: string }): Promise<PaginatedResponse<Institution>>
    createData(data: { name: string }): Promise<ApiResponse>
    updateData(id: number, data: { name: string }): Promise<ApiResponse>
    deleteData(id:number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<InstitutionSelect[]>>
}