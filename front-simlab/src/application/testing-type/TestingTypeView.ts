import { TestingType } from "../../domain/testing-type/TestingType";

export class TestingTypeView {
    private constructor(
        readonly id: number,
        readonly testingType: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}

    static fromDomain(entity: TestingType) {
        return new TestingTypeView(
            entity.id,
            entity.testingType,
            entity.createdAt,
            entity.updatedAt
        )
    }
}