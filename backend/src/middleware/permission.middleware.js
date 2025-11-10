const logger = require('../config/logger');

exports.checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Admin has all permissions
            if (user.role === 'admin') {
                return next();
            }

            // Check if user has the required permission
            if (!user.permissions || !user.permissions.includes(requiredPermission)) {
                logger.warn(`Permission denied for user ${user.userId}: ${requiredPermission}`);
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            logger.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                message: 'Permission check failed'
            });
        }
    };
};