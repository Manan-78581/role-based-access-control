import api from './api';
import { Organization, ApiResponse } from '../types';

export const organizationService = {
    create: (data: Partial<Organization>) => 
        api.post<ApiResponse<Organization>>('/organizations', data),
    
    getCurrent: () => 
        api.get<ApiResponse<Organization>>('/organizations/current'),
    
    update: (id: string, data: Partial<Organization>) => 
        api.put<ApiResponse<Organization>>(`/organizations/${id}`, data),
    
    updateTheme: (id: string, theme: Organization['theme']) => 
        api.patch<ApiResponse<Organization>>(`/organizations/${id}/theme`, { theme }),
    
    updateModules: (id: string, modules: Organization['modules']) => 
        api.patch<ApiResponse<Organization>>(`/organizations/${id}/modules`, { modules }),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/organizations/${id}`)
};