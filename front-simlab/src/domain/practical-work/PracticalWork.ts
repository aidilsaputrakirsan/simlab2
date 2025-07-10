import { StudyProgram } from "../study-program/StudyProgram";

export class PracticalWork {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly studyProgramId: number,
        readonly sks: number,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgram
    ){}
}