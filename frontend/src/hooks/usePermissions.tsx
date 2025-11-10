import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const usePermissions = () => {
    const { user, hasPermission, isOwner } = useAuth();

    const canCreate = useCallback((resourceType: string): boolean => {
        return hasPermission(`${resourceType}:create`);
    }, [hasPermission]);

    const canRead = useCallback((resourceType: string): boolean => {
        return hasPermission(`${resourceType}:read`);
    }, [hasPermission]);

    const canUpdate = useCallback((resourceType: string, authorId: string): boolean => {
        return hasPermission(`${resourceType}:update`) && 
               (user?.role === 'admin' || isOwner(authorId));
    }, [hasPermission, isOwner, user]);

    const canDelete = useCallback((resourceType: string, authorId: string): boolean => {
        return hasPermission(`${resourceType}:delete`) && 
               (user?.role === 'admin' || isOwner(authorId));
    }, [hasPermission, isOwner, user]);

    const canManageRoles = useCallback((): boolean => {
        return hasPermission('roles:assign');
    }, [hasPermission]);

    return {
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canManageRoles,
        isOwner
    };
};

export default usePermissions;