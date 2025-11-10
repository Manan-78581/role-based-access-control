const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.active) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = {
            userId: user._id,
            role: user.role,
            permissions: user.permissions,
            organizationId: user.organizationId
        };

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};