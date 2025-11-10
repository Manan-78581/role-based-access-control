// Finance Types
export interface Invoice {
    _id: string;
    organizationId: string;
    invoiceNumber: string;
    customer: string; // Customer ID
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    items: {
        product: string;
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    dueDate: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    _id: string;
    organizationId: string;
    invoiceId: string;
    amount: number;
    method: 'cash' | 'bank-transfer' | 'card' | 'cheque';
    status: 'pending' | 'completed' | 'failed';
    reference: string;
    date: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface Expense {
    _id: string;
    organizationId: string;
    category: string;
    amount: number;
    date: string;
    paymentMethod: string;
    description: string;
    receipt?: string;
    approvedBy?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}