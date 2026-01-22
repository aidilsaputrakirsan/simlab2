import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { TestingRequestInputDTO, TestingRequestTableParam, TestingRequestVerifyDTO } from "./TestingRequestDTO";
import { TestingRequestView } from "./TestingRequestView";
import { TestingRequestRepository } from "@/infrastructure/testing-request/TestingRequestRepository";
import { TestingRequestApprovalView } from "./TestingRequestApprovalView";

export class TestingRequestService {
    private readonly testingRequestRepository = new TestingRequestRepository()

    async getTestingRequestData(params: TestingRequestTableParam): Promise<PaginatedResponse<TestingRequestView>> {
        const testingRequests = await this.testingRequestRepository.getAll(params)

        return {
            ...testingRequests,
            data: testingRequests.data.map(TestingRequestView.fromDomain) || []
        }
    }

    async getTestingRequestForVerification(params: TestingRequestTableParam): Promise<PaginatedResponse<TestingRequestView>> {
        const testingRequests = await this.testingRequestRepository.getTestingRequestForVerification(params)

        return {
            ...testingRequests,
            data: testingRequests.data.map(TestingRequestView.fromDomain) || []
        }
    }

    async createData(data: TestingRequestInputDTO): Promise<ApiResponse<TestingRequestView>> {
        const testingRequest = await this.testingRequestRepository.createData(data)

        return {
            ...testingRequest,
            data: testingRequest.data ? TestingRequestView.fromDomain(testingRequest.data) : undefined
        }
    }

    async verifyTestingRequest(booking_id: number, data: TestingRequestVerifyDTO): Promise<ApiResponse> {
        return await this.testingRequestRepository.verifyTestingRequest(booking_id, data);
    }

    async getTestingRequestDetail(id: number): Promise<ApiResponse<TestingRequestView>> {
        const testingRequest = await this.testingRequestRepository.getTestingRequestData(id)

        return {
            ...testingRequest,
            data: testingRequest.data ? TestingRequestView.fromDomain(testingRequest.data) : undefined
        }
    }

    async getTestingRequestApprovals(id: number): Promise<ApiResponse<TestingRequestApprovalView[]>> {
        const testingRequestApprovals = await this.testingRequestRepository.getTestingRequestApprovals(id);
        return {
            ...testingRequestApprovals,
            data: testingRequestApprovals.data ? testingRequestApprovals.data.map(TestingRequestApprovalView.fromDomain) : []
        };
    }

    async uploadReport(id: number, file: File): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('result_file', file);
        return await this.testingRequestRepository.uploadReport(id, formData);
    }
}