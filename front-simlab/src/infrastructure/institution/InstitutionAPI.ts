import { Institution } from "@/domain/institution/Institution"

export type InstitutionAPI = {
    id: number,
    name: string,
    total_account: number
}

export function toDomain(api: InstitutionAPI): Institution {
    return new Institution(
        api.id,
        api.name,
        api.total_account
    )
}