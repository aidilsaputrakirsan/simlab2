import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types"
import { TestingCategory } from "./TestingCategory"
import { TestingCategorySelect } from "./TestingCategorySelect"

export interface ITestingCategoryRepository {
    getAll(params: {
        page: number
        per_page: number,
        search: string
    }): Promise<PaginatedResponse<TestingCategory>>

    createData(data: {
        name: string,
    }): Promise<ApiResponse>

    updateData(id: number, data: {
        name: string
    }): Promise<ApiResponse>

    deleteData(id: number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<TestingCategorySelect[]>>
}