export interface LoginCredentials {
    email: string, 
    password: string
}

export interface RegisterCredentials {
    name: string,
    identity_num: string,
    role: string,
    study_program_id: number | null,
    institution_id: number | null,
    institution: string,
    email: string,
    password: string,
    c_password: string
}