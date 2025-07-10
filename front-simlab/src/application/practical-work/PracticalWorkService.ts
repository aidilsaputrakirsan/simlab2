import { PracticalWorkRepository } from "@/infrastructure/practical-work/PracticalWorkRepository";
import { PracticalWorkInputDTO, PracticalWorkTableParam } from "./dto/PracticalWorkDTO";
import { PaginatedResponse } from "@/shared/Types";
import { PracticalWorkView } from "./PracticalWorkView";

export class PracticalWorkService {
    private readonly practicalWorkRepository = new PracticalWorkRepository()

    async getPracticalWorkData(params: PracticalWorkTableParam): Promise<PaginatedResponse<PracticalWorkView>> {
        const practicalWork = await this.practicalWorkRepository.getAll(params)
        
        return {
            ...practicalWork,
            data: practicalWork.data.map(PracticalWorkView.fromDomain)
        }
    }

    async createData(data: PracticalWorkInputDTO) {
        return await this.practicalWorkRepository.createData(data)
    }

    async updateData(id: number, data: PracticalWorkInputDTO) {
        return await this.practicalWorkRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.practicalWorkRepository.deleteData(id)
    }
}