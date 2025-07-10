export class Major {
    constructor(
        readonly id: number,
        readonly majorCode: string,
        readonly name: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}
}