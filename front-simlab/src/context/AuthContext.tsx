import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, LoginCredentials, User } from "../types/Auth";
import { AuthApi } from "../api/AuthApi";


const AuthContext = createContext<AuthContextType | null>(null)

type AuthProps = {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initialAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await AuthApi.getCurrentUser(token)
                    
                    setUser(response.data)
                } catch (error) {
                    console.log(error);
                    
                    // localStorage.removeItem('token')
                }
            }
            setLoading(false)
        }

        initialAuth();
    }, [])

    const login = async (credential: LoginCredentials) => {
        try {
            const response = await AuthApi.login(credential);
            
            // if (!response.ok) throw new Error('Login Failed')
            setToken(response.data.token)
            setUser(response.data.user)
            localStorage.setItem('token', response.data.token)
        } catch (error) {
            console.log(error);
            // throw new Error(error)
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}