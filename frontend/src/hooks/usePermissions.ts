import { Permission } from '../types';
import { useAuth } from '../context/AuthContext';

export default function usePermissions() {
    const auth = useAuth();

    const canCreate = (module: string): boolean => {
        return auth.hasPermission(`${module}:create` as Permission);
    };

    const canRead = (module: string): boolean => {
        return auth.hasPermission(`${module}:read` as Permission);
    };

    const canUpdate = (module: string): boolean => {
        return auth.hasPermission(`${module}:update` as Permission);
    };

    const canDelete = (module: string): boolean => {
        return auth.hasPermission(`${module}:delete` as Permission);
    };

    const canManageRoles = (): boolean => {
        return auth.hasPermission('roles:assign' as Permission);
    };

    return {
        user: auth.user,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canManageRoles
    };
}