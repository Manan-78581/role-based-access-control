const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    settings: {
        modules: [{
            name: String,
            enabled: { type: Boolean, default: true }
        }],
        theme: {
            type: String,
            default: 'light'
        }
    },
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'basic', 'premium'],
            default: 'free'
        },
        expiresAt: Date
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);