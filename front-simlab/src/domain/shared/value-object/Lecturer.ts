export class Lecturer {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly identityNumber: string,
        readonly studyProgram?: string,
        readonly institution?: string
    ){}
}