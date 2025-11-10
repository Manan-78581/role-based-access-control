import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const leadService = {
    getAll: () => axios.get(`${API_BASE}/api/crm/leads`, { withCredentials: true }),
    create: (data: any) => axios.post(`${API_BASE}/api/crm/leads`, data, { withCredentials: true }),
    update: (id: string, data: any) => axios.put(`${API_BASE}/api/crm/leads/${id}`, data, { withCredentials: true }),
    delete: (id: string) => axios.delete(`${API_BASE}/api/crm/leads/${id}`, { withCredentials: true })
};