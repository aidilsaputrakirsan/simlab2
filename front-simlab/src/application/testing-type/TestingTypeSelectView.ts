import { TestingTypeSelect } from "@/domain/testing-type/TestingTypeSelect";
import { MoneyView } from "../money/MoneyView";

export class TestingTypeSelectView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly unit: string,
        readonly price: MoneyView
    ){}

    static fromDomain(entity: TestingTypeSelect): TestingTypeSelectView {
        return new TestingTypeSelectView(
            entity.id,
            entity.name,
            entity.unit,
            MoneyView.toViewModel(entity.price)
        )
    }
}