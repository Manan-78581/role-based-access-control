import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, AuthContextType, LoginData, RegisterData, Permission } from '../types';
import { apiClient } from '../utils/api';

export const AuthContext = createContext<AuthContextType | null>(null);

export type { AuthContextType };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { user, organization, token } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setOrganization(organization);
        return { user, organization, token };
    };

    const register = async (data: RegisterData) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
        setOrganization(null);
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await apiClient.get('/auth/me');
            const { user, organization } = response.data;
            setUser(user);
            setOrganization(organization);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        return user.permissions.includes(permission as Permission);
    };

    const isOwner = (resourceAuthorId: string): boolean => {
        if (!user) return false;
        return user._id === resourceAuthorId;
    };

    const value: AuthContextType = {
        user,
        organization,
        loading,
        initialized,
        login,
        register,
        logout,
        checkAuth,
        hasPermission,
        isOwner
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};