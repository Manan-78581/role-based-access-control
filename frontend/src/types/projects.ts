// Projects Types
export interface Project {
    _id: string;
    organizationId: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
    startDate: string;
    endDate: string;
    manager: string; // Employee ID
    team: string[]; // Array of Employee IDs
    budget: number;
    progress: number;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    organizationId: string;
    projectId: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assignee: string; // Employee ID
    dueDate: string;
    estimatedHours: number;
    actualHours: number;
    dependencies: string[]; // Array of Task IDs
    attachments: {
        name: string;
        url: string;
        uploadedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface TimeLog {
    _id: string;
    organizationId: string;
    projectId: string;
    taskId: string;
    userId: string;
    description: string;
    hours: number;
    date: string;
    billable: boolean;
    createdAt: string;
    updatedAt: string;
}