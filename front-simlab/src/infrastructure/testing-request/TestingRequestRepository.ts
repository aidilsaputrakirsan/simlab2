import { ITestingRequestRepository } from "@/domain/testing-request/ITestingRequestRepository";
import { TestRequest } from "@/domain/testing-request/TestingRequest";
import { PaginatedResponse } from "@/presentation/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { TestingRequestApi, toDomain } from "./TestingRequestAPI";

export class TestingRequestRepository implements ITestingRequestRepository {
    async getAll(params: { page: number; per_page: number; search: string; filter_status?: string; }): Promise<PaginatedResponse<TestRequest>> {
        const queryString = generateQueryStringFromObject(params);
        const response = await fetchApi(`/testing-requests?${queryString}`, { method: 'GET' })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<TestingRequestApi>

            return {
                ...data,
                data: data.data?.map(toDomain) || []
            }
        }
        throw json['message']
    }
}