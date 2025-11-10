import { Organization, OrganizationFormData } from './organizations';
import { Lead, Customer, Activity } from './crm';
import { Employee, Department, Leave, Meeting } from './hr';
import { Invoice, Payment, Expense } from './finance';
import { Project, Task, TimeLog } from './projects';

export type Role = 'admin' | 'manager' | 'supervisor' | 'employee' | 'viewer';

export interface User {
    _id: string;
    username: string;
    email: string;
    role: Role;
    organizationId: string;
    permissions: Permission[];
    active: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    profile?: {
        firstName?: string;
        lastName?: string;
        avatar?: string;
        phone?: string;
        department?: string;
        position?: string;
    };
}

export interface AuthContextType {
    user: User | null;
    organization: Organization | null;
    loading: boolean;
    initialized: boolean;
    login: (email: string, password: string) => Promise<{ user: User; token: string }>;
    register: (data: RegisterData) => Promise<{ user: User }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
    isOwner: (resourceAuthorId: string) => boolean;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    organizationName?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ErrorResponse {
    message: string;
    errors?: string[];
}

export type Permission =
    // Organization permissions
    | 'org:manage'
    | 'org:read'
    // User permissions
    | 'users:create'
    | 'users:read'
    | 'users:update'
    | 'users:delete'
    // Role permissions
    | 'roles:assign'
    | 'roles:read'
    // CRM permissions
    | 'crm:create'
    | 'crm:read'
    | 'crm:update'
    | 'crm:delete'
    // HR permissions
    | 'hr:create'
    | 'hr:read'
    | 'hr:update'
    | 'hr:delete'
    // Finance permissions
    | 'finance:create'
    | 'finance:read'
    | 'finance:update'
    | 'finance:delete'
    // Project permissions
    | 'projects:create'
    | 'projects:read'
    | 'projects:update'
    | 'projects:delete';

export interface RolePermissions {
    [role: string]: Permission[];
}

export interface UserUpdateData {
    username?: string;
    email?: string;
    role?: Role;
    active?: boolean;
    organizationId?: string;
}

export type {
    Organization,
    OrganizationFormData,
    // CRM types
    Lead,
    Customer,
    Activity,
    // HR types
    Employee,
    Department,
    Leave,
    Meeting,
    // Finance types
    Invoice,
    Payment,
    Expense,
    // Project types
    Project,
    Task,
    TimeLog
};