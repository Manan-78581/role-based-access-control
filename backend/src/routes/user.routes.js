const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');
const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Validation middleware
const validateUserUpdate = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address')
];

// Routes
router.get('/', 
    checkPermission('users:read'), 
    userController.getAllUsers
);

router.get('/:id', 
    checkPermission('users:read'), 
    userController.getUserById
);

router.put('/:id', 
    checkPermission('users:update'),
    validateUserUpdate,
    userController.updateUser
);

router.delete('/:id', 
    checkPermission('users:delete'), 
    userController.deleteUser
);

module.exports = router;