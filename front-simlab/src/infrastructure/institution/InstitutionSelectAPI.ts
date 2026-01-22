import { InstitutionSelect } from "@/domain/institution/InstitutionSelect"

export type InstitutionSelectAPI = {
    id: number,
    name: string
}

export function toDomain(api: InstitutionSelectAPI): InstitutionSelect {
    return new InstitutionSelect(
        api.id,
        api.name
    )
}