import api from './api';
import { Project, Task, TimeLog, ApiResponse } from '../types';

export const projectService = {
    create: (data: Partial<Project>) => 
        api.post<ApiResponse<Project>>('/projects', data),
    
    getAll: () => 
        api.get<ApiResponse<Project[]>>('/projects'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Project>>(`/projects/${id}`),
    
    update: (id: string, data: Partial<Project>) => 
        api.put<ApiResponse<Project>>(`/projects/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/projects/${id}`),
    
    updateStatus: (id: string, status: Project['status']) => 
        api.patch<ApiResponse<Project>>(`/projects/${id}/status`, { status }),
    
    updateProgress: (id: string, progress: number) => 
        api.patch<ApiResponse<Project>>(`/projects/${id}/progress`, { progress })
};

export const taskService = {
    create: (data: Partial<Task>) => 
        api.post<ApiResponse<Task>>('/projects/tasks', data),
    
    getAll: () => 
        api.get<ApiResponse<Task[]>>('/projects/tasks'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Task>>(`/projects/tasks/${id}`),
    
    getByProject: (projectId: string) => 
        api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`),
    
    update: (id: string, data: Partial<Task>) => 
        api.put<ApiResponse<Task>>(`/projects/tasks/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/projects/tasks/${id}`),
    
    updateStatus: (id: string, status: Task['status']) => 
        api.patch<ApiResponse<Task>>(`/projects/tasks/${id}/status`, { status })
};

export const timeLogService = {
    create: (data: Partial<TimeLog>) => 
        api.post<ApiResponse<TimeLog>>('/projects/time-logs', data),
    
    getAll: () => 
        api.get<ApiResponse<TimeLog[]>>('/projects/time-logs'),
    
    getByProject: (projectId: string) => 
        api.get<ApiResponse<TimeLog[]>>(`/projects/${projectId}/time-logs`),
    
    getByTask: (taskId: string) => 
        api.get<ApiResponse<TimeLog[]>>(`/projects/tasks/${taskId}/time-logs`),
    
    update: (id: string, data: Partial<TimeLog>) => 
        api.put<ApiResponse<TimeLog>>(`/projects/time-logs/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/projects/time-logs/${id}`)
};