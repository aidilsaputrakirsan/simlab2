import { LaboratoryRoomSelect } from "@/domain/laboratory-room/LaboratoryRoomSelect";
import { MoneyView } from "../money/MoneyView";

export class LaboratoryRoomSelectView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly studentPrice: MoneyView,
        readonly lecturerPrice: MoneyView,
        readonly externalPrice: MoneyView,
    ){}

    static fromDomain(entity: LaboratoryRoomSelect): LaboratoryRoomSelectView {
        return new LaboratoryRoomSelectView(
            entity.id,
            entity.name,
            MoneyView.toViewModel(entity.studentPrice),
            MoneyView.toViewModel(entity.lecturerPrice),
            MoneyView.toViewModel(entity.externalPrice),
        )
    }
}