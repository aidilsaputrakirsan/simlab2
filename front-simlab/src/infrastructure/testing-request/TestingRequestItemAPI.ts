import { TestingRequestItem } from "@/domain/testing-request/TestingRequestItem"

export type TestingRequestItemAPI = {
    name: string,
    unit: string,
    quantity: number,
    price: number
}

export function toDomain(api: TestingRequestItemAPI): TestingRequestItem {
    return new TestingRequestItem(
        api.name,
        api.unit,
        api.quantity,
        api.price
    )
}