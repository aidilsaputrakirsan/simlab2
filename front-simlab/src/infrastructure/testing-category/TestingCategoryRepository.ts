import { ITestingCategoryRepository } from "@/domain/testing-category/ITestingCategoryRepository";
import { TestingCategory } from "@/domain/testing-category/TestingCategory";
import { TestingCategorySelect } from "@/domain/testing-category/TestingCategorySelect";
import { PaginatedResponse, ApiResponse } from "@/presentation/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { TestingCategoryAPI, toDomain as toTestingCategory } from "./TestingCategoryAPI";
import { TestingCategorySelectAPI, toDomain as toTestingCategorySelect } from "./TestingCategorySelectAPI";

export class TestingCategoryRepository implements ITestingCategoryRepository {
    async getAll(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<TestingCategory>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/testing-categories?${queryString}`, { method: 'GET' })
        const json = await response.json()

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<TestingCategoryAPI>
            return {
                ...data,
                data: data.data.map(toTestingCategory)
            }
        }

        throw json['message'];
    }

    async createData(data: { name: string; }): Promise<ApiResponse> {
        const response = await fetchApi('/testing-categories', {
            method: 'POST',
            body: JSON.stringify(data)
        })

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: { name: string; }): Promise<ApiResponse> {
        const response = await fetchApi(`/testing-categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })

        const json = await response.json()

        if (response.ok) {
            return json
        }
        throw json
    }

    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/testing-categories/${id}`, {
            method: 'DELETE'
        })

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async getDataForSelect(): Promise<ApiResponse<TestingCategorySelect[]>> {
        const response = await fetchApi(`/testing-categories/select`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as TestingCategorySelectAPI[]
            return {
                ...json,
                data: data.map(toTestingCategorySelect)
            }
        }
        throw json
    }
    
}