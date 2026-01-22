import { Publication } from "@/domain/publication/Publication";
import { Time } from "@/domain/time/Time";

export type PublicationAPI = {
    id: number;
    images: string;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    publication_category_id: number;
    publication_category: {
        id: number;
        name: string;
    };
    writer_id: number;
    writer: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

export function toDomain(api: PublicationAPI): Publication {
    return new Publication(
        api.id,
        api.images,
        api.title,
        api.slug,
        api.short_description,
        api.description,
        api.publication_category_id,
        api.publication_category.name,
        api.writer_id,
        api.writer.name,
        api.writer.email,
        new Time(api.created_at),
        new Time(api.updated_at)
    );
}
