import { TestingCategory } from "@/domain/testing-category/TestingCategory"

export type TestingCategoryAPI = {
    id: number,
    name: string,
}

export function toDomain(api: TestingCategoryAPI): TestingCategory {
    return new TestingCategory(
        api.id,
        api.name,
    )
}