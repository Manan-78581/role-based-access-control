const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    }
}, {
    timestamps: true
});

// Create indexes for common queries
postSchema.index({ authorId: 1, status: 1 });
postSchema.index({ status: 1, visibility: 1 });

module.exports = mongoose.model('Post', postSchema);