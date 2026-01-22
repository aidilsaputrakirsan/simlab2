import { TestingCategorySelect } from "@/domain/testing-category/TestingCategorySelect"

export type TestingCategorySelectAPI = {
    id: number,
    name: string
}

export function toDomain(api: TestingCategorySelectAPI): TestingCategorySelect {
    return new TestingCategorySelect(
        api.id,
        api.name
    )
}