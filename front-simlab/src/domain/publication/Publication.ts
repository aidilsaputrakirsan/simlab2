import { Time } from "../time/Time";

export class Publication {
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
        readonly createdAt: Time,
        readonly updatedAt: Time
    ) {}
}
