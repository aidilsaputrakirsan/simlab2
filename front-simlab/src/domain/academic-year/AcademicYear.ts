export class AcademicYear {
    constructor(
        readonly id: number,
        readonly academicYear: string,
        readonly status: 'Active' | 'Deactive',
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ) {}
}