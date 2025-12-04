import { PaginatedResponse } from "@/presentation/shared/Types";
import { TestingRequestTableParam } from "./TestingRequestDTO";
import { TestingRequestView } from "./TestingRequestView";
import { TestingRequestRepository } from "@/infrastructure/testing-request/TestingRequestRepository";

export class TestingRequestService {
    private readonly testingRequestRepository = new TestingRequestRepository()

    async getTestingRequestData(params: TestingRequestTableParam): Promise<PaginatedResponse<TestingRequestView>> {
        const testingRequests = await this.testingRequestRepository.getAll(params)

        return {
            ...testingRequests,
            data: testingRequests.data.map(TestingRequestView.fromDomain) || []
        }
    }
}