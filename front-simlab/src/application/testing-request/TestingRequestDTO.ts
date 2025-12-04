export interface TestingRequestTableParam {
    page: number,
    per_page: number,
    search: string,
    filter_status?: string
}

export interface TestingRequestInputDTO {
    phone_number: string,
    activity_name: string,
    supervisor: string | null,
    supervisor_email: string | null,
    testing_time: Date | undefined,
    information: string,
    testing_items: {
        testing_type_id: number | null,
        quantity: number | null
    }[]
}

export interface TestingRequestVerifyDTO {
    action: 'approve' | 'reject' | 'revision',
    laboran_id?: number,
    information?: string,
}