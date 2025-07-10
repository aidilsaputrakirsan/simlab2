import { LaboratoryRoom } from "@/domain/laboratory-room/LaboratoryRoom";
import { UserView } from "../user/UserView";

export class LaboratoryRoomView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly floor: string,
        readonly userId: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly user?: UserView
    ) { }

    static fromDomain(entity: LaboratoryRoom): LaboratoryRoomView {
        return new LaboratoryRoomView(
            entity.id,
            entity.name,
            entity.floor,
            entity.userId,
            entity.createdAt,
            entity.updatedAt,
            entity.user ? UserView.fromDomain(entity.user) : undefined
        )
    }
}