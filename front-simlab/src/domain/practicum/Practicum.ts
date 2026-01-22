import { StudyProgram } from "../study-program/StudyProgram";

export class Practicum {
    constructor(
        readonly id: number,
        readonly code: string,
        readonly name: string,
        readonly studyProgramId: number,
        readonly sks: number,
        readonly studyProgram?: StudyProgram
    ){}
}