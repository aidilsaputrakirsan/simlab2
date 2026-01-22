import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginCredentials, RegisterCredentials } from "../../domain/Auth/Auth";
import { StorageManager } from "../../infrastructure/StorageManager";
import LoadingPage from "@/presentation/components/LoadingPage";
import { UserView } from "../../application/user/UserView";
import { AuthService } from "../../application/auth/AuthService";
import { LoginDTO, RegisterDTO } from "../../application/auth/AuthDTO";

interface AuthContextType {
    user: UserView | null,
    token: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    register: (credentials: RegisterCredentials) => Promise<void>
    logout: () => void,
    checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProps = {
    children: React.ReactNode
}
const authService = new AuthService();

export const AuthProvider = ({ children }: AuthProps) => {
    const [user, setUser] = useState<UserView | null>(null)
    const [token, setToken] = useState<string | null>(StorageManager.getAccessToken())
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = async () => {
        try {
            const user = await authService.getCurrentUser(token || '')
            setUser(user)
        } catch (error: any) {
            if (error.code === 401 && location.pathname.startsWith('/panel')) {
                setUser(null)
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        const initialAuth = async () => {
            await checkAuth();
            setLoading(false)
        }

        initialAuth();
    }, [])

    const login = async (credentials: LoginDTO) => {
        const response = await authService.login(credentials);
        setUser(response)
    }

    const register = async (credentials: RegisterDTO): Promise<void> => {
        await authService.register(credentials)
    }

    const logout = async () => {
        const logout = await authService.logout();
        if (logout) {
            setToken(null)
            setUser(null)
            StorageManager.clear()
            navigate('/login')
        }
    }

    if (loading) {
        return <LoadingPage />
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}