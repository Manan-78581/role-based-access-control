// HR Types
export interface Employee {
    _id: string;
    organizationId: string;
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        address: string;
    };
    employmentDetails: {
        employeeId: string;
        department: string;
        position: string;
        startDate: string;
        endDate?: string;
        status: 'active' | 'inactive' | 'on-leave';
        employmentType: 'full-time' | 'part-time' | 'contract';
    };
    documents: {
        type: string;
        name: string;
        url: string;
        uploadedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Department {
    _id: string;
    organizationId: string;
    name: string;
    description: string;
    manager: string; // Employee ID
    parentDepartment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Leave {
    _id: string;
    organizationId: string;
    employeeId: string;
    type: 'annual' | 'sick' | 'parental' | 'unpaid';
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Meeting {
    _id: string;
    title: string;
    projectId: { _id: string; name: string };
    companyName: string;
    meetingDate: string;
    meetingTime: string;
    duration: number;
    attendees: string[];
    location?: string;
    meetingType: 'onboarding' | 'kickoff' | 'review' | 'planning';
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
}