import { PracticalWork } from "@/domain/practical-work/PracticalWork";
import { StudyProgramView } from "../study-program/StudyProgramView";

export class PracticalWorkView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly studyProgramId: number,
        readonly sks: number,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgramView
    ) {}

    static fromDomain(entity: PracticalWork): PracticalWorkView {
        return new PracticalWorkView(
            entity.id,
            entity.name,
            entity.studyProgramId,
            entity.sks,
            entity.createdAt,
            entity.updatedAt,
            entity.studyProgram ? StudyProgramView.fromDomain(entity.studyProgram) : undefined
        )
    }
}