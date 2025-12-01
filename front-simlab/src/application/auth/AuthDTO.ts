export interface LoginDTO {
    email: string, 
    password: string
}

export interface RegisterDTO {
    name: string,
    identity_num: string,
    role: string,
    study_program_id: number,
    email: string,
    password: string,
    c_password: string
}