import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types"
import { TestingRequest } from "./TestingRequest"

export interface ITestingRequestRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_status?: string
    }): Promise<PaginatedResponse<TestingRequest>>

    getTestingRequestForVerification(params: {
        page: number,
        per_page: number,
        search: string,
        filter_status?: string
    }): Promise<PaginatedResponse<TestingRequest>>

    createData(data: {
        phone_number: string,
        activity_name: string,
        supervisor: string | null,
        supervisor_email: string | null,
        testing_time: Date | undefined,
        information: string,
        testing_items: {
            testing_type_id: number | null,
            quantity: number | null
        }[]
    }): Promise<ApiResponse<TestingRequest>>

    verifyTestingRequest(
        testing_request_id: number,
        data: {
            action: 'approve' | 'reject' | 'revision',
            laboran_id?: number,
            information?: string,
        }
    ): Promise<ApiResponse>;

    getTestingRequestData(id: number): Promise<ApiResponse<TestingRequest>>
}