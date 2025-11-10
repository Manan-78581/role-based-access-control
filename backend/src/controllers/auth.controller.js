const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Organization = require('../models/organization.model');
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

const setTokenCookie = (res, token, refreshToken) => {
    // Set access token in cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
    });

    // Set refresh token in cookie
    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 604800000 // 7 days
        });
    }
};

exports.register = async (req, res) => {
    try {
        logger.info('Registration attempt:', { body: { ...req.body, password: '[HIDDEN]' } });
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Create new user with basic permissions
        const user = new User({
            username,
            email,
            password,
            role: 'admin',
            permissions: ['org:manage', 'crm:create', 'crm:read', 'crm:update', 'crm:delete', 'projects:create', 'projects:read', 'projects:update', 'projects:delete'],
            profile: {
                firstName: username,
                avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
            }
        });

        await user.save();

        await user.save();

        // Create a default organization for the user
        try {
            const org = await Organization.create({
                name: `${username}'s Organization`,
                domain: email.split('@')[1],
                settings: {
                    modules: [
                        { name: 'crm', enabled: true },
                        { name: 'projects', enabled: true },
                        { name: 'hr', enabled: true },
                        { name: 'inventory', enabled: true },
                        { name: 'finance', enabled: true }
                    ]
                }
            });

            user.organizationId = org._id;
            await user.save();
        } catch (orgErr) {
            logger.warn('Organization creation failed:', orgErr);
        }

        logger.info(`New user registered: ${user._id}`);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering user' 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || !user.active) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const token = generateToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Set cookies
        setTokenCookie(res, token, refreshToken);

        logger.info(`User logged in: ${user._id}`);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in' 
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ 
                message: 'Refresh token required' 
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.active) {
            return res.status(401).json({ 
                message: 'Invalid refresh token' 
            });
        }

        const newToken = generateToken(user._id, user.role);
        setTokenCookie(res, newToken);

        res.json({ token: newToken });
    } catch (error) {
        logger.error('Token refresh error:', error);
        res.status(401).json({ 
            message: 'Invalid refresh token' 
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

exports.me = async (req, res) => {
    try {
        // If auth middleware attached req.user, use it; otherwise try to decode from cookie/header
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let organization = null;
        try {
            if (user.organizationId) {
                organization = await Organization.findById(user.organizationId).lean();
            }
        } catch (orgErr) {
            // log and continue without organization
            logger.warn('Failed to load organization for /me:', orgErr);
        }

        res.json({
            success: true,
            data: {
                user: user.toJSON(),
                organization
            }
        });
    } catch (error) {
        logger.error('/me error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};