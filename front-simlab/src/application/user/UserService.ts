import { UserRepository } from "@/infrastructure/user/UserRepository";
import { UserInputDTO, UserTableParams } from "./UserDTO";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { UserView } from "./UserView";
import { userRole } from "@/domain/User/UserRole";
import { UserSelectView } from "./UserSelectView";

export class UserService {
    private userRepository = new UserRepository()

    async getUserData(params: UserTableParams): Promise<PaginatedResponse<UserView>> {
        const users = await this.userRepository.getAll(params)

        return {
            ...users,
            data: users.data.map(UserView.fromDomain)
        }
    }

    async createData(data: UserInputDTO): Promise<ApiResponse> {
        return await this.userRepository.createData(data)
    }

    async updateData(id: number, data: UserInputDTO): Promise<ApiResponse> {
        return await this.userRepository.updateData(id, data)
    }

    async deleteData(id: number): Promise<ApiResponse> {
        return await this.userRepository.deleteData(id)
    }

    async restoreToDosen(id: number): Promise<ApiResponse> {
        return await this.userRepository.restoreToDosen(id)
    }

    async getDataForSelect(roles: userRole | userRole[], major_id?: number): Promise<ApiResponse<UserSelectView[]>> {
        const users = await this.userRepository.getDataForSelect(roles, major_id)

        return {
            ...users,
            data: users.data ? users.data.map(UserSelectView.fromDomain) : undefined
        }
    }

    async toggleManager(id: number): Promise<ApiResponse<UserView>> {
        const user = await this.userRepository.toggleManager(id);

        return {
            ...user,
            data: user.data ? UserView.fromDomain(user.data) : undefined
        }
    }
}