import { InstitutionRepository } from "@/infrastructure/institution/InstitutionRepository";
import { InstitutionInputDTO, InstitutionTableParam } from "./dto/InstitutionDTO";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { InstitutionView } from "./InstitutionView.";
import { InstitutionSelectView } from "./InstitutionSelectView";

export class InstitutionService {
    private readonly institutionRepository = new InstitutionRepository()

    async getInstitutionData(params: InstitutionTableParam): Promise<PaginatedResponse<InstitutionView>> {
        const institutions = await this.institutionRepository.getAll(params)

        return {
            ...institutions,
            data: institutions.data.map(InstitutionView.fromDomain) || []
        }
    }

    async createData(data: InstitutionInputDTO): Promise<ApiResponse> {
        return await this.institutionRepository.createData(data)
    }

    async updateData(id: number, data: InstitutionInputDTO): Promise<ApiResponse> {
        return await this.institutionRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.institutionRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<InstitutionSelectView[]>> {
        const institutions = await this.institutionRepository.getDataForSelect()

        return {
            ...institutions,
            data: institutions.data ? institutions.data.map(InstitutionSelectView.fromDomain) : undefined
        }
    }
}