export interface TahunAkademik {
    id: number,
    academic_year: string,
    status: 'Active' | 'Deactive',
    created_at: Date | null,
    updated_at: Date | null
}

export interface TahunAkademikResponse {
    success: boolean,
    data: {
        data: TahunAkademik[],
        total: number,
        last_page: number
    },
    message: string
}