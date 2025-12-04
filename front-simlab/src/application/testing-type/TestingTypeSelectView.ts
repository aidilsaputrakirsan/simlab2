import { TestingTypeSelect } from "@/domain/testing-type/TestingTypeSelect";

export class TestingTypeSelectView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly unit: string
    ){}

    static fromDomain(entity: TestingTypeSelect): TestingTypeSelectView {
        return new TestingTypeSelectView(
            entity.id,
            entity.name,
            entity.unit
        )
    }
}