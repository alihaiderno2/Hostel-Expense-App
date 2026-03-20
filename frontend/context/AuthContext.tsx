import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    name: string; 
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType| null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    const decoded = jwtDecode<User>(token);
                    setUser(decoded);
                }
            }catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }     
        };
            loadUser();
        }, []);

    const login = async (email: string, password: string) => {
        try{
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;

            await SecureStore.setItemAsync('token', token);
            setUser(user);
            return {success: true};
        }
        catch (error : any) {
            return {
                success: false,
                message: error.response?.data?.msg || 'Login failed'
            }
        }
    };
    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};
