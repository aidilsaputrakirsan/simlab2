import { LaboratoryRoom } from "@/domain/laboratory-room/LaboratoryRoom";
import { UserView } from "../user/UserView";
import { MoneyView } from "../money/MoneyView";

export class LaboratoryRoomView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly floor: string,
        readonly userId: string,
        readonly studentPrice: MoneyView,
        readonly lecturerPrice: MoneyView,
        readonly externalPrice: MoneyView,
        readonly user?: UserView
    ) { }

    static fromDomain(entity: LaboratoryRoom): LaboratoryRoomView {
        return new LaboratoryRoomView(
            entity.id,
            entity.name,
            entity.floor,
            entity.userId,
            MoneyView.toViewModel(entity.studentPrice),
            MoneyView.toViewModel(entity.lecturerPrice),
            MoneyView.toViewModel(entity.externalPrice),
            entity.user ? UserView.fromDomain(entity.user) : undefined
        )
    }
}