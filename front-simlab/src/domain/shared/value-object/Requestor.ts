export class Requestor {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly identityNum: string,
        readonly studyProgram?: string,
        readonly institution?: string,
        readonly isMahasiswa: boolean = false
    ){}
}