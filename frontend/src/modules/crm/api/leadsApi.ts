import { apiClient } from '../../../utils/api';
import { Lead } from '../../../types';

export const leadsApi = {
    getAll: async (): Promise<Lead[]> => {
        const response = await apiClient.get('/api/crm/leads');
        return response.data;
    },

    getOne: async (id: string): Promise<Lead> => {
        const response = await apiClient.get(`/api/crm/leads/${id}`);
        return response.data;
    },

    create: async (data: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
        const response = await apiClient.post('/api/crm/leads', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Lead>): Promise<Lead> => {
        const response = await apiClient.put(`/api/crm/leads/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/crm/leads/${id}`);
    },

    updateStatus: async (id: string, status: Lead['status']): Promise<Lead> => {
        const response = await apiClient.patch(`/api/crm/leads/${id}/status`, { status });
        return response.data;
    }
};