import { Institution } from "@/domain/institution/Institution";

export class InstitutionView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly totalAccount?: number
    ) {}

    static fromDomain(entity: Institution): InstitutionView {
        return new InstitutionView(
            entity.id,
            entity.name,
            entity.totalAccount
        )
    }
}