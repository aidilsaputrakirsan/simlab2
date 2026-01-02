import { PublicationCategory } from "@/domain/publication-category/PublicationCategory";

export class PublicationCategoryView {
	constructor(
		readonly id: number,
		readonly name: string
	){}

	static fromDomain(entity: PublicationCategory): PublicationCategoryView {
		return new PublicationCategoryView(
			entity.id,
			entity.name
		)
	}
}
