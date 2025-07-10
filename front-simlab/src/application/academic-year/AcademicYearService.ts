import { PaginatedResponse } from "@/shared/Types";
import { AcademicYearView } from "./AcademicYearView";
import { AcademicYearInputDTO, AcademicYearTableParam } from "./dtos/AcademicYearDTO";
import { AcademicYearRepository } from "@/infrastructure/academic-year/AcademicYearRepository";

export class AcademicYearService {
    private readonly academicYearRepository = new AcademicYearRepository()

    async getAcademicYearData(params: AcademicYearTableParam): Promise<PaginatedResponse<AcademicYearView>> {
        const academicYear = await this.academicYearRepository.getAll(params)

        return {
            ...academicYear,
            data: academicYear.data.map(AcademicYearView.fromDomain) || []
        };
    }

    async createData(data: AcademicYearInputDTO) {
        return await this.academicYearRepository.createData(data)
    }

    async updateData(id: number, data: AcademicYearInputDTO) {
        return await this.academicYearRepository.updateData(id, data)
    }

    async toggleStatus(id: number): Promise<any> {
        return await this.academicYearRepository.toggleStatus(id);
    }

    async deleteData(id: number) {
        return await this.academicYearRepository.deleteData(id)
    }


}