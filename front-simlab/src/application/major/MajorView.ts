import { Major } from "../../../domain/major/Major";

export class MajorView {
    private constructor(
        readonly id: number,
        readonly majorCode: string,
        readonly name: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}

    static fromDomain(entity: Major) {
        return new MajorView(
            entity.id,
            entity.majorCode,
            entity.name,
            entity.createdAt,
            entity.updatedAt
        )
    }
}