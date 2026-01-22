import { TestingCategory } from "@/domain/testing-category/TestingCategory";

export class TestingCategoryView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: TestingCategory): TestingCategoryView {
        return new TestingCategoryView(
            entity.id,
            entity.name
        )
    }
}