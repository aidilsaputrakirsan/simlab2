import { PublicationCategoryRepository } from "@/infrastructure/publication-category/PublicationCategoryRepository";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { PublicationCategoryView } from "./PublicationCategoryView";
import { PublicationCategoryInputDTO, PublicationCategoryTableParam } from "./PublicationCategoryDTO";
import { PublicationCategorySelectView } from "./PublicationCategorySelectView";

export class PublicationCategoryService {
    private readonly publicationCategoryRepository = new PublicationCategoryRepository()

    async getPublicationCategoryData(params: PublicationCategoryTableParam): Promise<PaginatedResponse<PublicationCategoryView>> {
        const publicationCategories = await this.publicationCategoryRepository.getAll(params)

        return {
            ...publicationCategories,
            data: publicationCategories.data.map(PublicationCategoryView.fromDomain) || []
        }
    }

    async createData(data: PublicationCategoryInputDTO): Promise<ApiResponse> {
        return await this.publicationCategoryRepository.createData(data)
    }

    async updateData(id: number, data: PublicationCategoryInputDTO): Promise<ApiResponse> {
        return await this.publicationCategoryRepository.updateData(id, data)
    }

    async deleteData(id: number): Promise<ApiResponse> {
        return await this.publicationCategoryRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<PublicationCategorySelectView[]>> {
        const publicationCategories = await this.publicationCategoryRepository.getDataForSelect()

        return {
            ...publicationCategories,
            data: publicationCategories.data ? publicationCategories.data.map(PublicationCategorySelectView.fromDomain) : undefined
        }
    }
}
