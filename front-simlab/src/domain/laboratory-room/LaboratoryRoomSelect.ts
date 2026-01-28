export class LaboratoryRoomSelect {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly studentPrice: number,
        readonly lecturerPrice: number,
        readonly externalPrice: number,
    ){}
}