import { InstitutionSelect } from "@/domain/institution/InstitutionSelect";

export class InstitutionSelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: InstitutionSelect): InstitutionSelectView {
        return new InstitutionSelectView(
            entity.id,
            entity.name
        )
    }
}