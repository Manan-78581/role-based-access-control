// CRM Types
export interface Lead {
    _id: string;
    organizationId: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
    source: string;
    assignedTo: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface Customer {
    _id: string;
    organizationId: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    type: 'individual' | 'business';
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
}

export interface Activity {
    _id: string;
    organizationId: string;
    type: 'call' | 'meeting' | 'email' | 'task';
    subject: string;
    description: string;
    status: 'planned' | 'completed' | 'cancelled';
    dueDate: string;
    relatedTo: {
        type: 'lead' | 'customer';
        id: string;
    };
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
}