import { TestingRequestItem } from "@/domain/testing-request/TestingRequestItem";
import { MoneyView } from "../money/MoneyView";

export class TestingRequestItemView {
    constructor(
        readonly name: string,
        readonly unit: string,
        readonly quantity: number,
        readonly price: MoneyView
    ){}

    static fromDomain(entity: TestingRequestItem): TestingRequestItemView {
        return new TestingRequestItemView(
            entity.name,
            entity.unit,
            entity.quantity,
            MoneyView.toViewModel(entity.price)
        )
    }
}