import api from './api';
import { Invoice, Payment, Expense, ApiResponse } from '../types';

export const invoiceService = {
    create: (data: Partial<Invoice>) => 
        api.post<ApiResponse<Invoice>>('/finance/invoices', data),
    
    getAll: () => 
        api.get<ApiResponse<Invoice[]>>('/finance/invoices'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Invoice>>(`/finance/invoices/${id}`),
    
    update: (id: string, data: Partial<Invoice>) => 
        api.put<ApiResponse<Invoice>>(`/finance/invoices/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/finance/invoices/${id}`),
    
    send: (id: string) => 
        api.post<ApiResponse<Invoice>>(`/finance/invoices/${id}/send`),
    
    markAsPaid: (id: string) => 
        api.patch<ApiResponse<Invoice>>(`/finance/invoices/${id}/paid`)
};

export const paymentService = {
    create: (data: Partial<Payment>) => 
        api.post<ApiResponse<Payment>>('/finance/payments', data),
    
    getAll: () => 
        api.get<ApiResponse<Payment[]>>('/finance/payments'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Payment>>(`/finance/payments/${id}`),
    
    getByInvoice: (invoiceId: string) => 
        api.get<ApiResponse<Payment[]>>(`/finance/payments/invoice/${invoiceId}`),
    
    update: (id: string, data: Partial<Payment>) => 
        api.put<ApiResponse<Payment>>(`/finance/payments/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/finance/payments/${id}`)
};

export const expenseService = {
    create: (data: Partial<Expense>) => 
        api.post<ApiResponse<Expense>>('/finance/expenses', data),
    
    getAll: () => 
        api.get<ApiResponse<Expense[]>>('/finance/expenses'),
    
    getById: (id: string) => 
        api.get<ApiResponse<Expense>>(`/finance/expenses/${id}`),
    
    update: (id: string, data: Partial<Expense>) => 
        api.put<ApiResponse<Expense>>(`/finance/expenses/${id}`, data),
    
    delete: (id: string) => 
        api.delete<ApiResponse<void>>(`/finance/expenses/${id}`),
    
    approve: (id: string) => 
        api.patch<ApiResponse<Expense>>(`/finance/expenses/${id}/approve`),
    
    reject: (id: string) => 
        api.patch<ApiResponse<Expense>>(`/finance/expenses/${id}/reject`)
};