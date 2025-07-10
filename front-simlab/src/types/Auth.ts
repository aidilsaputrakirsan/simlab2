export interface User {
    id: number
    name: string,
    email: string,
    role: string,
    prodi_id: number,
    identity_num: string
}

export interface AuthResponse {
    success: boolean,
    data: {
        token: string,
        user: User,
    }
    message: string
}

export interface LoginCredentials {
    email: string, 
    password: string
}

export interface AuthContextType {
    user: User | null,
    token: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => void,
    // isAuthenticated: boolean,
    // isAdmin: boolean
}