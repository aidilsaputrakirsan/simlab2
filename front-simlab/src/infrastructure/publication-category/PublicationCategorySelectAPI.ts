import { PublicationCategorySelect } from "@/domain/publication-category/PublicationCategorySelect"

export type PublicationCategorySelectAPI = {
    id: number,
    name: string
}

export function toDomain(api: PublicationCategorySelectAPI): PublicationCategorySelect {
    return new PublicationCategorySelect(
        api.id,
        api.name
    )
}
