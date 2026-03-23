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
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
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
            console.log('🔍 Attempting login with:', email);
            const res = await api.post('/auth/login', { email, password });
            console.log('✅ Login response:', res.data);
            const { token, user } = res.data;

            await SecureStore.setItemAsync('token', token);
            setUser(user);
            console.log('✅ Login successful, user:', user);
            return {success: true};
        }
        catch (error : any) {
            console.error('❌ Login error:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error config:', error.config);

            const isNetworkError = !error.response && error.message === 'Network Error';
            return {
                success: false,
                message: isNetworkError
                    ? 'Cannot reach server right now. Check internet and try again in a few seconds.'
                    : (error.response?.data?.msg || error.message || 'Login failed')
            }
        }
    };
    const signup = async (name: string, email: string, password: string) => {
        try {
            console.log('🔍 Attempting signup with:', email);
            const res = await api.post('/auth/register', { name, email, password });
            console.log('✅ Signup response:', res.data);
            const { token, user } = res.data;

            await SecureStore.setItemAsync('token', token);
            setUser(user);
            console.log('✅ Signup successful, user:', user);
            return { success: true };
        } catch (error: any) {
            console.error('❌ Signup error:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error response:', error.response);

            const isNetworkError = !error.response && error.message === 'Network Error';
            return {
                success: false,
                message: isNetworkError
                    ? 'Cannot reach server right now. Check internet and try again in a few seconds.'
                    : (error.response?.data?.msg || error.message || 'Signup failed')
            };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );

};
