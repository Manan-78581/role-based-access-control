const roles = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer'
};

const permissions = {
    // User permissions
    'users:create': ['admin'],
    'users:read': ['admin', 'editor', 'viewer'],
    'users:update': ['admin'],
    'users:delete': ['admin'],
    
    // Post permissions
    'posts:create': ['admin', 'editor'],
    'posts:read': ['admin', 'editor', 'viewer'],
    'posts:update': ['admin', 'editor'], // Note: Editors can only update their own posts
    'posts:delete': ['admin', 'editor'], // Note: Editors can only delete their own posts
    
    // Role management
    'roles:assign': ['admin'],
    'roles:read': ['admin'],
    
    // Audit permissions
    'audit:read': ['admin'],
    'audit:create': ['admin']
};

const roleHierarchy = {
    admin: ['editor', 'viewer'],
    editor: ['viewer'],
    viewer: []
};

module.exports = {
    roles,
    permissions,
    roleHierarchy
};