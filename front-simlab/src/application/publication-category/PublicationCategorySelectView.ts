import { PublicationCategorySelect } from "@/domain/publication-category/PublicationCategorySelect";

export class PublicationCategorySelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: PublicationCategorySelect): PublicationCategorySelectView {
        return new PublicationCategorySelectView(
            entity.id,
            entity.name
        )
    }
}
