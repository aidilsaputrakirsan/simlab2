import { StudyProgram } from "../../domain/study-program/StudyProgram";
import { User } from "../../domain/User/User";
import { StudyProgramAPI } from "../study-program/StudyProgramAPI";

export type UserApi = {
    id: number,
    name: string,
    email: string,
    role: string,
    prodi_id: number,
    identity_num: string,
    created_at: Date,
    updated_at: Date
    study_program?: StudyProgramAPI
}

export function toDomain(api: UserApi): User {
    return new User(
        api.id,
        api.name,
        api.email,
        api.role,
        api.prodi_id,
        api.identity_num,
        api.created_at,
        api.updated_at,
        api.study_program ?
        new StudyProgram(
            api.study_program.id,
            api.study_program.jurusan_id,
            api.study_program.name,
            api.study_program.created_at,
            api.study_program.updated_at
        ) : undefined
    )
}