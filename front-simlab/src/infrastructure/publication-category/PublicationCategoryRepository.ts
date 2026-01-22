import { IPublicationCategoryRepository } from "@/domain/publication-category/IPublicationCategoryRepository";
import { PublicationCategory } from "@/domain/publication-category/PublicationCategory";
import { PublicationCategorySelect } from "@/domain/publication-category/PublicationCategorySelect";
import { PaginatedResponse, ApiResponse } from "@/presentation/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { PublicationCategoryAPI, toDomain as toPublicationCategory } from "./PublicationCategoryAPI";
import { PublicationCategorySelectAPI, toDomain as toPublicationCategorySelect } from "./PublicationCategorySelectAPI";

export class PublicationCategoryRepository implements IPublicationCategoryRepository {
    async getAll(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<PublicationCategory>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/publication-categories?${queryString}`, { method: 'GET' })
        const json = await response.json()

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PublicationCategoryAPI>
            return {
                ...data,
                data: data.data.map(toPublicationCategory)
            }
        }

        throw json['message'];
    }

    async createData(data: { name: string; }): Promise<ApiResponse> {
        const response = await fetchApi('/publication-categories', {
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
        const response = await fetchApi(`/publication-categories/${id}`, {
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
        const response = await fetchApi(`/publication-categories/${id}`, {
            method: 'DELETE'
        })

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async getDataForSelect(): Promise<ApiResponse<PublicationCategorySelect[]>> {
        const response = await fetchApi(`/publication-categories/select`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PublicationCategorySelectAPI[]
            return {
                ...json,
                data: data.map(toPublicationCategorySelect)
            }
        }
        throw json
    }
}
