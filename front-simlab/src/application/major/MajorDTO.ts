export interface MajorInputDTO {
    faculty_id: number | null;
    code: string | null;
    name: string | null;
}

export interface MajorTableParam {
    page: number,
    per_page: number,
    search: string,
    filter_faculty?: number
}