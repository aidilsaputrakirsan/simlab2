import { IPublicationRepository } from "@/domain/publication/IPublicationRepository";
import { Publication } from "@/domain/publication/Publication";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { fetchApi, jsonToFormData } from "../ApiClient";
import { PublicationAPI, toDomain } from "./PublicationAPI";
import { generateQueryStringFromObject } from "../Helper";

export class PublicationRepository implements IPublicationRepository {
    async getPublications(params: {
        page?: number;
        per_page?: number;
        search?: string;
        publication_category_id?: number;
        writer_id?: number;
    }): Promise<PaginatedResponse<Publication>> {
        const queryParams = generateQueryStringFromObject(params);
        const response = await fetchApi(`/publications?${queryParams.toString()}`, {
            method: 'GET'
        });

        const json = await response.json() as ApiResponse;

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PublicationAPI>;
            return {
                ...data,
                data: data.data?.map(toDomain) || []
            };
        }

        throw json;
    }

    async getPublicationById(id: number): Promise<ApiResponse<Publication>> {
        const response = await fetchApi(`/publications/${id}`, {
            method: 'GET'
        });

        const json = await response.json() as ApiResponse;

        if (response.ok) {
            const publication = toDomain(json.data as PublicationAPI);
            return {
                ...json,
                data: publication
            };
        }

        throw json;
    }

    async getPublicationData(slug: string): Promise<ApiResponse<Publication>> {
        const response = await fetchApi(`/publications/content/${slug}`, {
            method: 'GET'
        });

        const json = await response.json() as ApiResponse;

        if (response.ok) {
            const publication = toDomain(json.data as PublicationAPI);
            return {
                ...json,
                data: publication
            };
        }

        throw json;
    }

    async createPublication(data: {
        title: string;
        slug?: string;
        short_description: string;
        description: string;
        publication_category_id: number;
        writer_id: number;
        images: File | null;
    }): Promise<ApiResponse<Publication>> {
        const bodyFormData = jsonToFormData(data, 'POST');

        const response = await fetchApi('/publications', {
            method: 'POST',
            body: bodyFormData
        });

        const json = await response.json() as ApiResponse;

        if (response.ok) {
            const publication = toDomain(json.data as PublicationAPI);
            return {
                ...json,
                data: publication
            };
        }

        throw json;
    }

    async updatePublication(id: number, data: {
        title: string;
        slug?: string;
        short_description: string;
        description: string;
        publication_category_id: number;
        writer_id: number;
        images?: File | null;
    }): Promise<ApiResponse<Publication>> {
        const bodyFormData = jsonToFormData(data, 'PUT');

        const response = await fetchApi(`/publications/${id}`, {
            method: 'POST',
            body: bodyFormData
        });

        const json = await response.json() as ApiResponse;

        if (response.ok) {
            const publication = toDomain(json.data as PublicationAPI);
            return {
                ...json,
                data: publication
            };
        }

        throw json;
    }

    async deletePublication(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/publications/${id}`, {
            method: 'DELETE'
        });

        const json = await response.json() as ApiResponse;

        if (response.ok) {
            return json;
        }

        throw json;
    }
}
