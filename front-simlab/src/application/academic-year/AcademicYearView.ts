import { AcademicYear } from "@/domain/academic-year/AcademicYear";

export class AcademicYearView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly status: 'Active' | 'Deactive',
    ){}

    static fromDomain(entity: AcademicYear) {
        return new AcademicYearView(
            entity.id,
            entity.name,
            entity.status,
        )
    }
}