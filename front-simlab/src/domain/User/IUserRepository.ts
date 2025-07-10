import { User } from "./User"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { UserTableParams } from "@/application/user/dto/UserDTO"

export interface IUserRepository {
    getAll(params: UserTableParams): Promise<PaginatedResponse<User>>
    createData(data: Record<string, any>): Promise<ApiResponse>
    updateData(id: number, data: Record<string, any>): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
    restoreToDosen(id:number): Promise<ApiResponse>
}