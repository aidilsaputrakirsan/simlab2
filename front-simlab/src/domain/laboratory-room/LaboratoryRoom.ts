import { User } from "../User/User";

export class LaboratoryRoom {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly floor: string,
        readonly userId: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly user?: User
    ) {}
}