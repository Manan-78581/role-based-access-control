import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { 
    User, 
    Organization,
    AuthContextType, 
    LoginData, 
    RegisterData, 
    ApiResponse,
    Permission 
} from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [initialized, setInitialized] = useState<boolean>(false);

    const login = useCallback(async (email: string, password: string) => {
        try {
            console.log('Attempting login with:', { email, password: '***' });
            console.log('API base URL:', api.defaults.baseURL);
            
            const response = await api.post('/auth/login', { email, password });
            
            console.log('Login response status:', response.status);
            console.log('Login response headers:', response.headers);
            console.log('Login response data:', response.data);
            
            const user = response.data?.data?.user || response.data?.user || response.data;
            const token = response.data?.data?.token || response.data?.token;
            
            console.log('Extracted user:', user);
            console.log('Extracted token:', token);
            
            if (user) {
                setUser(user);
                setLoading(false);
                return { user, token };
            } else {
                throw new Error('No user data in response');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message || 'Login failed';
                throw new Error(message);
            }
            throw error;
        }
    }, []);

    const register = useCallback(async (userData: RegisterData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Registration failed');
            }
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout', {});
            setUser(null);
            setOrganization(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Clear user state even if logout fails
            setUser(null);
            setOrganization(null);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            // Try to get current user
            const meResp = await api.get('/auth/me');
            if (meResp.data?.data) {
                setUser(meResp.data.data.user || null);
                setOrganization(meResp.data.data.organization || null);
                return;
            }

            // If /me didn't return data, try refreshing token then re-check
            await api.post('/auth/refresh-token', {});
            const meResp2 = await api.get('/auth/me');
            if (meResp2.data?.data) {
                setUser(meResp2.data.data.user || null);
                setOrganization(meResp2.data.data.organization || null);
            } else {
                setUser(null);
                setOrganization(null);
            }
        } catch (error) {
            setUser(null);
            setOrganization(null);
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    }, []);

    // Run auth check on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const hasPermission = useCallback((permission: string): boolean => {
        if (!user) return false;
        
        if (user.role === 'admin') return true;
        
        return user.permissions.includes(permission as Permission);
    }, [user]);

    const isOwner = useCallback((resourceAuthorId: string): boolean => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user._id === resourceAuthorId;
    }, [user]);

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