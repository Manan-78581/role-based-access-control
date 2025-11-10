import axios from 'axios';
import { User, Organization, ApiResponse } from '../types';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add organization context
api.interceptors.request.use(
    config => {
        // Add organization header if available
        const organizationId = localStorage.getItem('organizationId');
        if (organizationId) {
            config.headers['X-Organization-ID'] = organizationId;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Use the api instance so baseURL and withCredentials are applied
                await api.post('/auth/refresh-token');
                return api(originalRequest);
            } catch (refreshError) {
                // Clear auth data
                localStorage.removeItem('organizationId');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle organization-related errors
        if (error.response?.status === 403 && 
            error.response?.data?.code === 'INVALID_ORGANIZATION') {
            localStorage.removeItem('organizationId');
            window.location.href = '/select-organization';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// Set organization context
export const setOrganizationContext = (organizationId: string) => {
    localStorage.setItem('organizationId', organizationId);
};

// Clear organization context
export const clearOrganizationContext = () => {
    localStorage.removeItem('organizationId');
};

export const userService = {
    getAll: () => api.get<ApiResponse<User[]>>('/users'),
    getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
    update: (id: string, data: Partial<User>) => api.put<ApiResponse<User>>(`/users/${id}`, data),
    delete: (id: string) => api.delete<ApiResponse<void>>(`/users/${id}`),
    changeRole: (id: string, role: string) => api.patch<ApiResponse<User>>(`/users/${id}/role`, { role }),
    inviteToOrganization: (email: string, role: string) => 
        api.post<ApiResponse<void>>('/users/invite', { email, role })
};

export default api;