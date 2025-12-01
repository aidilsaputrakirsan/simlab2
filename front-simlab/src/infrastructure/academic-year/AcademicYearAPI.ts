import { AcademicYear } from "../../domain/academic-year/AcademicYear";

export type AcademicYearAPI = {
    id: number;
    name: string;
    status: string;
}

export function toDomain(api: AcademicYearAPI): AcademicYear  {
    return new AcademicYear(
        api.id,
        api.name,
        api.status as 'Active' | 'Deactive',
    )
}