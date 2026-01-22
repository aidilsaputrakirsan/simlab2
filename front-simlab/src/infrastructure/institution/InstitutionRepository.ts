import { IInstitutionRepository } from "@/domain/institution/IInstitutionRepository";
import { Institution } from "@/domain/institution/Institution";
import { InstitutionSelect } from "@/domain/institution/InstitutionSelect";
import { PaginatedResponse, ApiResponse } from "@/presentation/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { InstitutionAPI, toDomain } from "./InstitutionAPI";
import { InstitutionSelectAPI, toDomain as toInstitutionSelect } from "./InstitutionSelectAPI";

export class InstitutionRepository implements IInstitutionRepository {
    async getAll(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<Institution>> {
        const queryString = generateQueryStringFromObject(params);

        const response = await fetchApi(`/institutions?${queryString}`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<InstitutionAPI>;
            return {
                ...data,
                data: data.data?.map(toDomain) || []
            };
        }
        throw json;
    }
    async createData(data: { name: string; }): Promise<ApiResponse> {
        const response = await fetchApi('/institutions', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return json
        }
        throw json
    }
    async updateData(id: number, data: { name: string; }): Promise<ApiResponse> {
        const response = await fetchApi(`/institutions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return json
        }

        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/institutions/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return json
        }

        throw json
    }
    async getDataForSelect(): Promise<ApiResponse<InstitutionSelect[]>> {
        const response = await fetchApi(`/institutions/select`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as InstitutionSelectAPI[]
            return {
                ...json,
                data: data.map(toInstitutionSelect)
            }
        }
        throw json
    }

}