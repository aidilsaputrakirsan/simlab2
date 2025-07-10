export interface PracticalWorkInputDTO {
    name: string;
    prodi_id: number | null;
    sks: number
} 

export interface PracticalWorkTableParam {
    page: number,
    per_page: number,
    search: string,
    filter_study_program?: number
}