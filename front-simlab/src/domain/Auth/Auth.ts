import { User } from "../User/User"

export interface LoginCredentials {
    email: string, 
    password: string
}

export interface RegisterCredentials {
    name: string,
    identity_num: string,
    role: string,
    prodi_id: string,
    email: string,
    password: string,
    c_password: string
}