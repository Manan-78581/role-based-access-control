const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'supervisor', 'employee', 'viewer'],
        default: 'viewer'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    permissions: [{
        type: String,
        enum: [
            // Organization permissions
            'org:manage', 'org:read',
            // User permissions
            'users:create', 'users:read', 'users:update', 'users:delete',
            // Role permissions
            'roles:assign', 'roles:read',
            // CRM permissions
            'crm:create', 'crm:read', 'crm:update', 'crm:delete',
            // HR permissions
            'hr:create', 'hr:read', 'hr:update', 'hr:delete', 'hr:approveLeave',
            // Inventory permissions
            'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete',
            // Finance permissions
            'finance:create', 'finance:read', 'finance:update', 'finance:delete',
            'finance:approve', 'finance:export',
            // Project permissions
            'projects:create', 'projects:read', 'projects:update', 'projects:delete',
            'projects:assign'
        ]
    }],
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        phone: String,
        department: String,
        position: String
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            inApp: {
                type: Boolean,
                default: true
            }
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Password hashing error:', error);
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);