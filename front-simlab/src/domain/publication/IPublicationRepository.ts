import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { Publication } from "./Publication";

export interface IPublicationRepository {
    getPublications(params: {
        page?: number;
        per_page?: number;
        search?: string;
        publication_category_id?: number;
        writer_id?: number;
    }): Promise<PaginatedResponse<Publication>>;
    
    getPublicationById(id: number): Promise<ApiResponse<Publication>>;
    getPublicationData(slug: string): Promise<ApiResponse<Publication>>;
    
    createPublication(data: {
        title: string;
        slug?: string;
        short_description: string;
        description: string;
        publication_category_id: number;
        writer_id: number;
        images: File | null;
    }): Promise<ApiResponse<Publication>>;
    
    updatePublication(id: number, data: {
        title: string;
        slug?: string;
        short_description: string;
        description: string;
        publication_category_id: number;
        writer_id: number;
        images?: File | null;
    }): Promise<ApiResponse<Publication>>;
    
    deletePublication(id: number): Promise<ApiResponse>;
}
