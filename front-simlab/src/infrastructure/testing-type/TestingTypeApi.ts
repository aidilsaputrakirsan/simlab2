import { TestingType } from "../../domain/testing-type/TestingType"

export type TestingTypeApi = {
    id: number;
    testing_type: string;
    created_at: Date | null;
    updated_at: Date | null;
}

export function toDomain(api: TestingTypeApi): TestingType {
    return new TestingType(
        api.id,
        api.testing_type,
        api.created_at,
        api.updated_at
    )
}