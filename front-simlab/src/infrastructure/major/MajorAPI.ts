import { Major } from "../../domain/major/Major";

export type MajorAPI= {
    id: number;
    major_code: string;
    name: string;
    created_at: Date | null;
    updated_at: Date | null;
}

export function toDomain(api: MajorAPI): Major {
    return new Major(
        api.id,
        api.major_code,
        api.name,
        api.created_at,
        api.updated_at
    )
}