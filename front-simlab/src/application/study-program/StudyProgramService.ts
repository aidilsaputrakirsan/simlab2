import { StudyProgramRepository } from "../../infrastructure/study-program/StudyProgramRepository";
import { PaginatedResponse } from "../../shared/Types";
import { StudyProgramInputDTO, StudyProgramTableParam } from "./dto/StudyProgramDTO";
import { StudyProgramView } from "./StudyProgramView";

export class StudyProgramService {
    private studyProgramRepository = new StudyProgramRepository()

    async getStudyProgramData(params: StudyProgramTableParam): Promise<PaginatedResponse<StudyProgramView>> {
        const studyProgram = await this.studyProgramRepository.getAll(params)
        
        return {
            ...studyProgram,
            data: studyProgram.data.map(StudyProgramView.fromDomain) || []
        }
    }

    async createData(data: StudyProgramInputDTO) {
        return await this.studyProgramRepository.createData(data)
    }

    async updateData(id: number, data: StudyProgramInputDTO) {
        return await this.studyProgramRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.studyProgramRepository.deleteData(id)
    }
}