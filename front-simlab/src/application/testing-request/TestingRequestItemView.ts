import { TestingRequestItem } from "@/domain/testing-request/TestingRequestItem";

export class TestingRequestItemView {
    constructor(
        readonly name: string,
        readonly unit: string,
        readonly quantity: number
    ){}

    static fromDomain(entity: TestingRequestItem): TestingRequestItemView {
        return new TestingRequestItemView(
            entity.name,
            entity.unit,
            entity.quantity
        )
    }
}