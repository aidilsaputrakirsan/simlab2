import { AuthRepository } from "@/infrastructure/auth/AuthRepository";
import { UserView } from "../user/UserView";
import { ForgotPasswordDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from "./AuthDTO";

export class AuthService {
    private authRepository = new AuthRepository()

    async getCurrentUser(token: string): Promise<UserView> {
        const user = await this.authRepository.getCurrentUser(token)
        return UserView.fromDomain(user)
    }

    async login(credentials: LoginDTO): Promise<UserView> {
        const user = await this.authRepository.login(credentials)
        return UserView.fromDomain(user)
    }

    async register(credentials: RegisterDTO): Promise<void> {
        return await this.authRepository.register(credentials)
    }

    async forgotPassword(credentials: ForgotPasswordDTO): Promise<string> {
        return await this.authRepository.forgotPassword(credentials)
    }

    async resetPassword(credentials: ResetPasswordDTO): Promise<string> {
        return await this.authRepository.resetPassword(credentials)
    }

    async logout(): Promise<boolean> {
        return await this.authRepository.logout()
    }
}