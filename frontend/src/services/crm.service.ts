import api from './api';
import { Lead, Customer, Activity, ApiResponse } from '../types';

export const leadService = {
    create: (data: Partial<Lead>) => 
        api.post<ApiResponse<Lead>>('/crm/leads', data),
    
    getAll: () => 
        api.get<ApiResponse<Lead[]>>('/crm/leads'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Lead>>(`/crm/leads/${id}`),
    
    update: (id: string, data: Partial<Lead>) => 
        api.put<ApiResponse<Lead>>(`/crm/leads/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/crm/leads/${id}`)
};

export const customerService = {
    create: (data: Partial<Customer>) => 
        api.post<ApiResponse<Customer>>('/crm/customers', data),
    
    getAll: () => 
        api.get<ApiResponse<Customer[]>>('/crm/customers'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Customer>>(`/crm/customers/${id}`),
    
    update: (id: string, data: Partial<Customer>) => 
        api.put<ApiResponse<Customer>>(`/crm/customers/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/crm/customers/${id}`)
};

export const activityService = {
    create: (data: Partial<Activity>) => 
        api.post<ApiResponse<Activity>>('/crm/activities', data),
    
    getAll: () => 
        api.get<ApiResponse<Activity[]>>('/crm/activities'),
    
    getByRelated: (type: 'lead' | 'customer', id: string) => 
        api.get<ApiResponse<Activity[]>>(`/crm/activities/related/${type}/${id}`),
    
    update: (id: string, data: Partial<Activity>) => 
        api.put<ApiResponse<Activity>>(`/crm/activities/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/crm/activities/${id}`)
};