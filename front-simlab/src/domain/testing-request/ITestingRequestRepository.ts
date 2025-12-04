import { PaginatedResponse } from "@/presentation/shared/Types"
import { TestRequest } from "./TestingRequest"

export interface ITestingRequestRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_status?: string
    }): Promise<PaginatedResponse<TestRequest>>
}