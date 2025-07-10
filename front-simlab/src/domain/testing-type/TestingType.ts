export class TestingType {
    constructor(
        readonly id: number,
        readonly testingType: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}
}