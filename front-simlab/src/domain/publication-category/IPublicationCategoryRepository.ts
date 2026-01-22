import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types"
import { PublicationCategory } from "./PublicationCategory"
import { PublicationCategorySelect } from "./PublicationCategorySelect"

export interface IPublicationCategoryRepository {
    getAll(params: {
        page: number
        per_page: number,
        search: string
    }): Promise<PaginatedResponse<PublicationCategory>>

    createData(data: {
        name: string,
    }): Promise<ApiResponse>

    updateData(id: number, data: {
        name: string
    }): Promise<ApiResponse>

    deleteData(id: number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<PublicationCategorySelect[]>>
}
