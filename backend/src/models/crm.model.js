const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
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
    phone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
        default: 'new'
    },
    source: {
        type: String,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String
    },
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedAt: Date,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    activities: [{
        type: {
            type: String,
            enum: ['note', 'call', 'meeting', 'email', 'task'],
            required: true
        },
        description: String,
        date: {
            type: Date,
            default: Date.now
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    convertedToCustomer: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create indexes
leadSchema.index({ organizationId: 1, email: 1 });
leadSchema.index({ organizationId: 1, status: 1 });
leadSchema.index({ organizationId: 1, assignedTo: 1 });
leadSchema.index({ organizationId: 1, createdBy: 1 });

const customerSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
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
    phone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    type: {
        type: String,
        enum: ['individual', 'business'],
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    convertedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    notes: [{
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create indexes
customerSchema.index({ organizationId: 1, email: 1 }, { unique: true });
customerSchema.index({ organizationId: 1, status: 1 });
customerSchema.index({ organizationId: 1, assignedTo: 1 });

const activitySchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    type: {
        type: String,
        enum: ['call', 'meeting', 'email', 'task'],
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['planned', 'completed', 'cancelled'],
        default: 'planned'
    },
    dueDate: {
        type: Date,
        required: true
    },
    relatedTo: {
        type: {
            type: String,
            enum: ['lead', 'customer'],
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'relatedTo.type'
        }
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedAt: Date,
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create indexes
activitySchema.index({ organizationId: 1, assignedTo: 1 });
activitySchema.index({ organizationId: 1, 'relatedTo.type': 1, 'relatedTo.id': 1 });
activitySchema.index({ organizationId: 1, dueDate: 1 });

const Lead = mongoose.model('Lead', leadSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Activity = mongoose.model('Activity', activitySchema);

module.exports = {
    Lead,
    Customer,
    Activity
};