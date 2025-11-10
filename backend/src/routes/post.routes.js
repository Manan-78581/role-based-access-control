const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');
const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Validation middleware
const validatePost = [
    body('title')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
];

// Routes
router.post('/', 
    checkPermission('posts:create'),
    validatePost,
    postController.createPost
);

router.get('/', 
    checkPermission('posts:read'),
    postController.getAllPosts
);

router.get('/:id', 
    checkPermission('posts:read'),
    postController.getPostById
);

router.put('/:id', 
    checkPermission('posts:update'),
    validatePost,
    postController.updatePost
);

router.delete('/:id', 
    checkPermission('posts:delete'),
    postController.deletePost
);

module.exports = router;