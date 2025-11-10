const Post = require('../models/post.model');
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

exports.createPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = new Post({
            ...req.body,
            authorId: req.user.userId
        });

        await post.save();
        logger.info(`Post created: ${post._id}`);

        res.status(201).json(post);
    } catch (error) {
        logger.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        let query = {};

        // Filter based on user role
        if (req.user.role === 'editor') {
            // Editors can see their own posts and public published posts
            query = {
                $or: [
                    { authorId: req.user.userId },
                    { status: 'published', visibility: 'public' }
                ]
            };
        } else if (req.user.role === 'viewer') {
            // Viewers can only see public published posts
            query = { status: 'published', visibility: 'public' };
        }
        // Admins can see all posts (no query filter)

        const posts = await Post.find(query)
            .populate('authorId', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        logger.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('authorId', 'username');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check visibility permissions
        if (req.user.role !== 'admin' && 
            post.authorId._id.toString() !== req.user.userId) {
            if (post.visibility === 'private' || 
                post.status !== 'published') {
                return res.status(403).json({ 
                    message: 'Access denied' 
                });
            }
        }

        res.json(post);
    } catch (error) {
        logger.error('Error fetching post:', error);
        res.status(500).json({ message: 'Error fetching post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check ownership unless admin
        if (req.user.role !== 'admin' && 
            post.authorId.toString() !== req.user.userId) {
            return res.status(403).json({ 
                message: 'Access denied' 
            });
        }

        Object.assign(post, req.body);
        await post.save();
        
        logger.info(`Post updated: ${post._id}`);
        res.json(post);
    } catch (error) {
        logger.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check ownership unless admin
        if (req.user.role !== 'admin' && 
            post.authorId.toString() !== req.user.userId) {
            return res.status(403).json({ 
                message: 'Access denied' 
            });
        }

        await Post.deleteOne({ _id: req.params.id });
        logger.info(`Post deleted: ${req.params.id}`);
        
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        logger.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};