import { TestingTypeRepository } from "../../infrastructure/testing-type/TestingTypeRepository";
import { PaginatedResponse } from "../../presentation/shared/Types";
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

    async createData(data: TestingTypeInputDTO) {
        return await this.testingTypeRepository.createData(data)
    }

    async updateData(id: number, data: TestingTypeInputDTO) {
        return await this.testingTypeRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.testingTypeRepository.deleteData(id)
    }
}   