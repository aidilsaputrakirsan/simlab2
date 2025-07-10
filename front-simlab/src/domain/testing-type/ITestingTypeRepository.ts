import { TestingTypeInputDTO, TestingTypeTableParam } from "../../application/testing-type/dtos/TestingTypeDTO"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { TestingType } from "./TestingType"

export interface ITestingTypeRepository {
    getAll(params: TestingTypeTableParam): Promise<PaginatedResponse<TestingType>>
    createData(data: TestingTypeInputDTO): Promise<ApiResponse>
    updateData(id: number, data: TestingTypeInputDTO): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}