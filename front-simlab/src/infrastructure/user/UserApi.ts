import { userRole } from "@/domain/User/UserRole";
import { User } from "../../domain/User/User";
import { StudyProgramAPI, toDomain as toStudyProgram } from "../study-program/StudyProgramAPI";
import { InstitutionAPI, toDomain as toInstitution } from "../institution/InstitutionAPI";
import { Time } from "@/domain/time/Time";

export type UserApi = {
    id: number,
    name: string,
    email: string,
    role: string,
    identity_num: string,
    is_manager: boolean,
    is_active: string,
    created_at: string | null,
    updated_at: string | null,
    institution?: InstitutionAPI
    study_program?: StudyProgramAPI,
}

export function toDomain(api: UserApi): User {
    return new User(
        api.id,
        api.name,
        api.email,
        api.role as userRole,
        api.identity_num,
        api.is_manager,
        api.is_active as 'Active' | 'Deactive',
        api.created_at ? new Time(api.created_at) : null,
        api.updated_at ? new Time(api.updated_at) : null,
        api.institution ? toInstitution(api.institution) : undefined,
        api.study_program ? toStudyProgram(api.study_program) : undefined,
    )
}