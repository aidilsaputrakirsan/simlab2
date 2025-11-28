import { TestingTypeRepository } from "../../infrastructure/testing-type/TestingTypeRepository";
import { ApiResponse, PaginatedResponse } from "../../presentation/shared/Types";
import { TestingTypeInputDTO, TestingTypeTableParam } from "./dtos/TestingTypeDTO";
import { TestingTypeView } from "./TestingTypeView";

export class TestingTypeService {
    private readonly testingTypeRepository = new TestingTypeRepository()

    async getTestingTypeData(params: TestingTypeTableParam): Promise<PaginatedResponse<TestingTypeView>> {
        const testingType = await this.testingTypeRepository.getAll(params)

        return {
            ...testingType,
            data: testingType.data.map(TestingTypeView.fromDomain) || []
        }
    }

    async createData(data: TestingTypeInputDTO): Promise<ApiResponse> {
        return await this.testingTypeRepository.createData(data)
    }

    async updateData(id: number, data: TestingTypeInputDTO): Promise<ApiResponse> {
        return await this.testingTypeRepository.updateData(id, data)
    }

    async deleteData(id: number): Promise<ApiResponse> {
        return await this.testingTypeRepository.deleteData(id)
    }
}   