import { TestingCategorySelect } from "@/domain/testing-category/TestingCategorySelect";

export class TestingCategorySelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: TestingCategorySelect): TestingCategorySelectView {
        return new TestingCategorySelectView(
            entity.id,
            entity.name
        )
    }
}