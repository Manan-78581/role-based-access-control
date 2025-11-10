const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: String,
    company: String,
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
        default: 'new'
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'social', 'email', 'phone', 'other'],
        default: 'other'
    },
    value: {
        type: Number,
        default: 0
    },
    notes: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);