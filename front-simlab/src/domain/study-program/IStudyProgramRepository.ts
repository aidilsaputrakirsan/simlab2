import { StudyProgramInputDTO, StudyProgramTableParam } from "../../application/study-program/dto/StudyProgramDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { StudyProgram } from "./StudyProgram"

export interface IStudyProgramRepository {
    getAll(params: StudyProgramTableParam): Promise<PaginatedResponse<StudyProgram>>
    createData(data: StudyProgramInputDTO): Promise<ApiResponse>
    updateData(id: number, data: StudyProgramInputDTO): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
    getPublicData(id: number): Promise<ApiResponse<StudyProgram[]>>
}