import { Major } from "../major/Major";

export class StudyProgram {
    constructor(
        readonly id: number,
        readonly majorId: number,
        readonly name: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly major?: Major
    ){}
}