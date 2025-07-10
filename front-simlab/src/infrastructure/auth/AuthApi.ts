import { UserApi } from "../user/UserApi";

export interface LoginResponseAPI {
    token: string,
    user: UserApi
}