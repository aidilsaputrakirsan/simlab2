import { Publication } from "@/domain/publication/Publication";
import { TimeView } from "../time/TimeView";

export class PublicationView {
    constructor(
        readonly id: number,
        readonly images: string,
        readonly title: string,
        readonly slug: string,
        readonly shortDescription: string,
        readonly description: string,
        readonly publicationCategoryId: number,
        readonly publicationCategoryName: string,
        readonly writerId: number,
        readonly writerName: string,
        readonly writerEmail: string,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView
    ) { }

    static fromDomain(publication: Publication): PublicationView {
        return new PublicationView(
            publication.id,
            publication.images,
            publication.title,
            publication.slug,
            publication.shortDescription,
            publication.description,
            publication.publicationCategoryId,
            publication.publicationCategoryName,
            publication.writerId,
            publication.writerName,
            publication.writerEmail,
            TimeView.fromDomain(publication.createdAt),
            TimeView.fromDomain(publication.updatedAt)
        );
    }

    imageUrl(): string {
        return `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${this.images}`;
    }
}
