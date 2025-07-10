import { User } from "@/domain/User/User";
import { StudyProgramView } from "../study-program/StudyProgramView";

export class UserView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: string,
        readonly studyProgramId: number,
        readonly identityNum: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgramView,
    ) { }

    static fromDomain(entity: User): UserView {
        return new UserView(
            entity.id,
            entity.name,
            entity.email,
            entity.role,
            entity.studyProgramId,
            entity.identityNum,
            entity.createdAt,
            entity.updatedAt,
            entity.studyProgram ? StudyProgramView.fromDomain(entity.studyProgram) : undefined
        )
    }
}