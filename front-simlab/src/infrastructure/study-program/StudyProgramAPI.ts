import { StudyProgram } from "../../domain/study-program/StudyProgram"
import { MajorAPI, toDomain as toMajor } from "../major/MajorAPI"

export type StudyProgramAPI = {
    id: number
    jurusan_id: number
    name: string,
    created_at: Date | null
    updated_at: Date | null
    major?: MajorAPI
}

export function toDomain(api: StudyProgramAPI): StudyProgram {
    return new StudyProgram(
        api.id,
        api.jurusan_id,
        api.name,
        api.created_at,
        api.updated_at,
        api.major ?
        toMajor(api.major)
         : undefined
    )
}