import { TestingTypeSelect } from "@/domain/testing-type/TestingTypeSelect";

export type TestingTypeSelectAPI = {
    id: number;
    name: string
}

export function toDomain(api: TestingTypeSelectAPI): TestingTypeSelect {
    return new TestingTypeSelect(
        api.id,
        api.name
    )
}