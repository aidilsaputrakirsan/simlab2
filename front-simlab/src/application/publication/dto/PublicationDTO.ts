export interface PublicationInputDTO {
    title: string;
    slug?: string;
    short_description: string;
    description: string;
    publication_category_id: number;
    writer_id: number;
    images: File | null;
}

export interface PublicationUpdateDTO {
    title: string;
    slug?: string;
    short_description: string;
    description: string;
    publication_category_id: number;
    writer_id: number;
    images?: File | null;
}
