import { StudyProgram } from "../../domain/study-program/StudyProgram"
import { MajorAPI, toDomain as toMajor } from "../major/MajorAPI"

export type StudyProgramAPI = {
    id: number
    major_id: number
    name: string,
    major?: MajorAPI
}

export function toDomain(api: StudyProgramAPI): StudyProgram {
    return new StudyProgram(
        api.id,
        api.major_id,
        api.name,
        api.major ?
            toMajor(api.major)
            : undefined
    )
}