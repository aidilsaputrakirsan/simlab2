import { AuthResponse, LoginCredentials, User } from "../types/Auth";
import { fetchApi } from "./ApiClient";

export const AuthApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return fetchApi('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
      },
    
    //   register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    //     return fetchApi('/auth/register', {
    //       method: 'POST',
    //       body: JSON.stringify(credentials)
    //     });
    //   },
    
      getCurrentUser: async (token: string): Promise<User> => {
        return fetchApi('/user/me', {
          method: 'GET',
          token
        });
      },
    
      logout: async (token: string): Promise<void> => {
        await fetchApi('/logout', {
          method: 'POST',
          token
        });
      }
}