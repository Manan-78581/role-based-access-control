import api from './api';
import { Employee, Department, Leave, Meeting, ApiResponse } from '../types';

export const employeeService = {
    create: (data: Partial<Employee>) => 
        api.post<ApiResponse<Employee>>('/hr/employees', data),
    
    getAll: () => 
        api.get<ApiResponse<Employee[]>>('/hr/employees'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Employee>>(`/hr/employees/${id}`),
    
    update: (id: string, data: Partial<Employee>) => 
        api.put<ApiResponse<Employee>>(`/hr/employees/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/hr/employees/${id}`)
};

export const departmentService = {
    create: (data: Partial<Department>) => 
        api.post<ApiResponse<Department>>('/hr/departments', data),
    
    getAll: () => 
        api.get<ApiResponse<Department[]>>('/hr/departments'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Department>>(`/hr/departments/${id}`),
    
    update: (id: string, data: Partial<Department>) => 
        api.put<ApiResponse<Department>>(`/hr/departments/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/hr/departments/${id}`)
};

export const leaveService = {
    create: (data: Partial<Leave>) => 
        api.post<ApiResponse<Leave>>('/hr/leaves', data),
    
    getAll: () => 
        api.get<ApiResponse<Leave[]>>('/hr/leaves'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Leave>>(`/hr/leaves/${id}`),
    
    update: (id: string, data: Partial<Leave>) => 
        api.put<ApiResponse<Leave>>(`/hr/leaves/${id}`, data),
    
    approve: (id: string) => 
        api.patch<ApiResponse<Leave>>(`/hr/leaves/${id}/approve`),
    
    reject: (id: string) => 
        api.patch<ApiResponse<Leave>>(`/hr/leaves/${id}/reject`),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/hr/leaves/${id}`)
};

export const meetingService = {
    getAll: () => 
        api.get<ApiResponse<Meeting[]>>('/hr/meetings'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Meeting>>(`/hr/meetings/${id}`),
    
    create: (data: Partial<Meeting>) => 
        api.post<ApiResponse<Meeting>>('/hr/meetings', data),
    
    update: (id: string, data: Partial<Meeting>) => 
        api.put<ApiResponse<Meeting>>(`/hr/meetings/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/hr/meetings/${id}`)
};