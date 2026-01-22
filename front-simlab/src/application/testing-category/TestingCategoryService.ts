import { TestingCategoryRepository } from "@/infrastructure/testing-category/TestingCategoryRepository";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { TestingCategoryView } from "./TestingCategoryView";
import { TestingCategoryInputDTO, TestingCategoryTableParam } from "./TestingCategoryDTO";
import { TestingCategorySelectView } from "./TestingCategorySelectView";

export class TestingCategoryService {
    private readonly testingCategoryRepository = new TestingCategoryRepository()

    async getTestingCategoryData(params: TestingCategoryTableParam): Promise<PaginatedResponse<TestingCategoryView>> {
        const testingCategories = await this.testingCategoryRepository.getAll(params)

        return {
            ...testingCategories,
            data: testingCategories.data.map(TestingCategoryView.fromDomain) || []
        }
    }

    async createData(data: TestingCategoryInputDTO): Promise<ApiResponse> {
        return await this.testingCategoryRepository.createData(data)
    }

    async updateData(id: number, data: TestingCategoryInputDTO): Promise<ApiResponse> {
        return await this.testingCategoryRepository.updateData(id, data)
    }

    async deleteData(id: number): Promise<ApiResponse> {
        return await this.testingCategoryRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<TestingCategorySelectView[]>> {
        const testingCategories = await this.testingCategoryRepository.getDataForSelect()

        return {
            ...testingCategories,
            data: testingCategories.data ? testingCategories.data.map(TestingCategorySelectView.fromDomain) : undefined
        }
    }
}