import { User } from "../User/User"
import { ForgotPasswordCredentials, LoginCredentials, RegisterCredentials, ResetPasswordCredentials } from "./Auth"

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<User>
    register(credentials: RegisterCredentials): Promise<void>
    forgotPassword(credentials: ForgotPasswordCredentials): Promise<string>
    resetPassword(credentials: ResetPasswordCredentials): Promise<string>
    logout(): Promise<boolean>,
    getCurrentUser(token:string): Promise<User>
}