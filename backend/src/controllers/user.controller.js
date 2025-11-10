const User = require('../models/user.model');
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        logger.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, role, active } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only admins can change roles and active status
        if (req.user.role === 'admin') {
            if (role) user.role = role;
            if (typeof active === 'boolean') user.active = active;
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        logger.info(`User updated: ${user._id}`);

        res.json(user.toJSON());
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ _id: req.params.id });
        logger.info(`User deleted: ${req.params.id}`);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

exports.changeRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent changing own role
        if (user._id.toString() === req.user.userId) {
            return res.status(403).json({ 
                message: 'Cannot change your own role' 
            });
        }

        user.role = role;
        await user.save();
        
        logger.info(`Role changed for user ${user._id} to ${role}`);
        res.json(user.toJSON());
    } catch (error) {
        logger.error('Error changing role:', error);
        res.status(500).json({ message: 'Error changing role' });
    }
};