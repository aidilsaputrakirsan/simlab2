import { Role } from "@/shared/Types"

export interface UserTableParams {
    page: number,
    per_page: number,
    search: string,
    filter_prodi?: number,
    role: Role
}

export interface UserInputDTO {
    name: string,
    email: string,
    role: string,
    prodi_id?: number,
    identity_num: string,
    password: string
}

export interface AdminInputDTO {
    name: string,
    email: string,
    password: string
}

export interface DosenInputDTO {
    name: string,
    email: string,
    role: string,
    prodi_id: number,
    identity_num: string,
    password: string
}