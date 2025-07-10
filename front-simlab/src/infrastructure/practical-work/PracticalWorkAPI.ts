import { PracticalWork } from "../../domain/practical-work/PracticalWork"
import { StudyProgramAPI, toDomain as toStudyProgram } from "../study-program/StudyProgramAPI"

export type PracticalWorkAPI = {
    id: number,
    name: string,
    prodi_id: number,
    sks: number,
    created_at: Date | null,
    updated_at: Date | null,
    study_program?: StudyProgramAPI
}

export function toDomain(api: PracticalWorkAPI): PracticalWork {
    return new PracticalWork(
        api.id,
        api.name,
        api.prodi_id,
        api.sks,
        api.created_at,
        api.updated_at,
        api.study_program ?
        toStudyProgram(api.study_program) : undefined
    );
}