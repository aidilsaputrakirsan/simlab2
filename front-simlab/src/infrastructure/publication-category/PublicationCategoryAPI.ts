import { PublicationCategory } from "@/domain/publication-category/PublicationCategory"

export type PublicationCategoryAPI = {
	id: number,
	name: string,
}

export function toDomain(api: PublicationCategoryAPI): PublicationCategory {
	return new PublicationCategory(
		api.id,
		api.name,
	)
}
