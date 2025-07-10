export interface StudyProgramInputDTO {
    jurusan_id: number | null
    name: string,
}

export interface StudyProgramTableParam {
    page: number,
    per_page: number,
    search: string,
    filter_major?: number
}