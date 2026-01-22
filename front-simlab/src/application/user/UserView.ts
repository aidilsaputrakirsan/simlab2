import { User } from "@/domain/User/User";
import { StudyProgramView } from "../study-program/StudyProgramView";
import { userRole } from "@/domain/User/UserRole";
import { InstitutionView } from "../institution/InstitutionView.";
import { TimeView } from "../time/TimeView";

export class UserView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: userRole,
        readonly identityNum: string,
        readonly isManager: boolean,
        readonly isActive: 'Active' | 'Deactive',
        readonly createdAt: TimeView | null,
        readonly updatedAt: TimeView | null,
        readonly studyProgram?: StudyProgramView,
        readonly institution?: InstitutionView
    ) { }

    static fromDomain(entity: User): UserView {
        return new UserView(
            entity.id,
            entity.name,
            entity.email,
            entity.role,
            entity.identityNum,
            entity.isManager,
            entity.isActive,
            entity.createdAt ? TimeView.fromDomain(entity.createdAt) : null,
            entity.updatedAt ? TimeView.fromDomain(entity.updatedAt) : null,
            entity.studyProgram ? StudyProgramView.fromDomain(entity.studyProgram) : undefined,
            entity.institution ? InstitutionView.fromDomain(entity.institution) : undefined
        )
    }
}