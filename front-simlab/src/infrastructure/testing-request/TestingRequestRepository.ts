import { ITestingRequestRepository } from "@/domain/testing-request/ITestingRequestRepository";
import { TestingRequest } from "@/domain/testing-request/TestingRequest";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { TestingRequestApi, toDomain } from "./TestingRequestAPI";
import { TestingRequestApproval } from "@/domain/testing-request/TestingRequestApproval";
import { TestingRequestApprovalAPI, toDomain as toTestingRequestApproval } from "./TestingRequestApprovalAPI";

export class TestingRequestRepository implements ITestingRequestRepository {
    async getAll(params: { page: number; per_page: number; search: string; filter_status?: string; }): Promise<PaginatedResponse<TestingRequest>> {
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

    async getTestingRequestForVerification(params: { page: number; per_page: number; search: string; filter_status?: string; }): Promise<PaginatedResponse<TestingRequest>> {
        const queryString = generateQueryStringFromObject(params);
        const response = await fetchApi(`/testing-requests/verification?${queryString}`, { method: 'GET' })
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

    async createData(data: {
        phone_number: string;
        activity_name: string;
        supervisor: string | null;
        supervisor_email: string | null;
        testing_time: Date | undefined;
        information: string;
        testing_items: {
            testing_type_id: number | null,
            name: string | null,
            quantity: number | null,
            unit: string | null,
            price: number | null,
            total: number | null
        }[];
    }): Promise<ApiResponse<TestingRequest>> {
        const response = await fetchApi("/testing-requests", {
            method: "POST",
            body: JSON.stringify(data)
        });

        const json = await response.json() as ApiResponse;
        if (response.ok) {
            return {
                ...json,
                data: toDomain(json.data)
            };
        }
        throw json;
    }

    async verifyTestingRequest(testing_request_id: number, data: { action: "approve" | "reject" | "revision"; laboran_id?: number; information?: string; }): Promise<ApiResponse> {
        const response = await fetchApi(`/testing-requests/${testing_request_id}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        if (response.ok) {
            return json
        }
        throw json;
    }

    async getTestingRequestData(id: number): Promise<ApiResponse<TestingRequest>> {
        const response = await fetchApi(`/testing-requests/${id}/detail`, {
            method: 'GET'
        })

        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as TestingRequestApi

            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }

    async getTestingRequestApprovals(id: number): Promise<ApiResponse<TestingRequestApproval[]>> {
        const response = await fetchApi(`/testing-requests/${id}/approvals`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const list = json['data'] as TestingRequestApprovalAPI[];
            return {
                ...json,
                data: list?.map(toTestingRequestApproval) || []
            }
        }
        throw json;
    }
}