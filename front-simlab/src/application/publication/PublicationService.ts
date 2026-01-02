import { IPublicationRepository } from "@/domain/publication/IPublicationRepository";
import { PublicationRepository } from "@/infrastructure/publication/PublicationRepository";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { PublicationInputDTO, PublicationUpdateDTO } from "./dto/PublicationDTO";
import { PublicationView } from "./PublicationView";

export class PublicationService {
    private readonly publicationRepository: IPublicationRepository = new PublicationRepository();

    async getPublications(params: {
        page?: number;
        per_page?: number;
        search?: string;
        publication_category_id?: number;
        writer_id?: number;
    }): Promise<PaginatedResponse<PublicationView>> {
        const response = await this.publicationRepository.getPublications(params);
        return {
            ...response,
            data: response.data.map(PublicationView.fromDomain) || []
        };
    }

    async getPublicationById(id: number): Promise<ApiResponse<PublicationView>> {
        const response = await this.publicationRepository.getPublicationById(id);

        return {
            ...response,
            data: response.data ? PublicationView.fromDomain(response.data) : undefined
        };
    }

    async getPublicationData(slug: string): Promise<ApiResponse<PublicationView>> {
        const response = await this.publicationRepository.getPublicationData(slug);

        return {
            ...response,
            data: response.data ? PublicationView.fromDomain(response.data) : undefined
        };
    }

    async createPublication(data: PublicationInputDTO): Promise<ApiResponse<PublicationView>> {
        const response = await this.publicationRepository.createPublication(data);

        return {
            ...response,
            data: response.data ? PublicationView.fromDomain(response.data) : undefined
        };
    }

    async updatePublication(id: number, data: PublicationUpdateDTO): Promise<ApiResponse<PublicationView>> {
        const response = await this.publicationRepository.updatePublication(id, data);

        return {
            ...response,
            data: response.data ? PublicationView.fromDomain(response.data) : undefined
        };
    }

    async deletePublication(id: number): Promise<ApiResponse> {
        return await this.publicationRepository.deletePublication(id);
    }
}
