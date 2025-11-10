export interface Organization {
    _id: string;
    name: string;
    logo?: string;
    theme: {
        primaryColor: string;
        mode: 'light' | 'dark';
    };
    modules: {
        crm: boolean;
        hr: boolean;
        inventory: boolean;
        finance: boolean;
        projects: boolean;
    };
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationFormData {
    name: string;
    logo?: string;
    theme?: {
        primaryColor: string;
        mode: 'light' | 'dark';
    };
    modules?: {
        crm: boolean;
        hr: boolean;
        inventory: boolean;
        finance: boolean;
        projects: boolean;
    };
}