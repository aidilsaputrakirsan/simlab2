import { User } from "../User/User"
import { LoginCredentials, RegisterCredentials } from "./Auth"

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<User>
    register(credentials: RegisterCredentials): Promise<void>
    logout(): Promise<boolean>,
    getCurrentUser(token:string): Promise<User>
}