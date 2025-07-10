import { StudyProgram } from "../study-program/StudyProgram";

export class User {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: string,
        readonly studyProgramId: number,
        readonly identityNum: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgram,
    ){}
}