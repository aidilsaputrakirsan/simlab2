import { TestingType } from "../../domain/testing-type/TestingType"

export type TestingTypeApi = {
    id: number;
    name: string;
    unit: string;
    student_price: number;
    lecturer_price: number;
    external_price: number;
    testing_category: {
        id: number,
        name: string
    }
}

export function toDomain(api: TestingTypeApi): TestingType {
    const testingType = new TestingType(
        api.id,
        api.name,
        api.unit,
        api.student_price,
        api.lecturer_price,
        api.external_price,
    )

    if (api.testing_category) {
        testingType.setTestingCategory(api.testing_category)
    }

    return testingType
}