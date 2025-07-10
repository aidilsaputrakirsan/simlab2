import { AcademicYearInputDTO, AcademicYearTableParam } from "@/application/academic-year/dtos/AcademicYearDTO";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { AcademicYear } from "./AcademicYear";

export interface IAdacemicYearRepository {
    getAll(params: AcademicYearTableParam): Promise<PaginatedResponse<AcademicYear>>
    createData(data: AcademicYearInputDTO): Promise<ApiResponse<AcademicYear>>
    updateData(id: number, data: AcademicYearInputDTO): Promise<ApiResponse<AcademicYear>>
    toggleStatus(id:number): Promise<ApiResponse<AcademicYear>>
    deleteData(id:number): Promise<ApiResponse>
}