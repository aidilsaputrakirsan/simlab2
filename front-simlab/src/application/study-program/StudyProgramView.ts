import { StudyProgram } from "../../domain/study-program/StudyProgram";
import { MajorView } from "../major/MajorView";

export class StudyProgramView {
    private constructor(
        readonly id: number,
        readonly majorId: number,
        readonly name: string,
        readonly major?: MajorView
    ) {}

    static fromDomain(entity: StudyProgram): StudyProgramView {
        return new StudyProgramView(
            entity.id,
            entity.majorId,
            entity.name,
            entity.major ? MajorView.fromDomain(entity.major) : undefined
        )
    }
}