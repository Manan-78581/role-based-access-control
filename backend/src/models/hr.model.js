const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
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
        dateOfBirth: Date,
        address: String,
        emergencyContact: {
            name: String,
            relationship: String,
            phone: String
        }
    },
    employmentDetails: {
        employeeId: {
            type: String,
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        position: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: Date,
        status: {
            type: String,
            enum: ['active', 'inactive', 'on-leave'],
            default: 'active'
        },
        employmentType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract'],
            required: true
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },
    documents: [{
        type: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const departmentSchema = new mongoose.Schema({
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
    description: String,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    parentDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }
}, {
    timestamps: true
});

const leaveSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    type: {
        type: String,
        enum: ['annual', 'sick', 'parental', 'unpaid'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    },
    attachments: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: Date,
    comments: [{
        content: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const attendanceSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    clockIn: Date,
    clockOut: Date,
    totalHours: Number,
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'leave'],
        required: true
    },
    notes: String,
    location: {
        type: {
            type: String,
            enum: ['office', 'remote', 'field'],
            default: 'office'
        },
        details: String
    }
}, {
    timestamps: true
});

// Create indexes
employeeSchema.index({ organizationId: 1, 'employmentDetails.employeeId': 1 }, { unique: true });
employeeSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
employeeSchema.index({ organizationId: 1, 'employmentDetails.department': 1 });
employeeSchema.index({ organizationId: 1, 'employmentDetails.status': 1 });

departmentSchema.index({ organizationId: 1, name: 1 }, { unique: true });
departmentSchema.index({ organizationId: 1, parentDepartment: 1 });

leaveSchema.index({ organizationId: 1, employeeId: 1, startDate: 1 });
leaveSchema.index({ organizationId: 1, status: 1 });

attendanceSchema.index({ organizationId: 1, employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ organizationId: 1, date: 1 });

const Employee = mongoose.model('Employee', employeeSchema);
const Department = mongoose.model('Department', departmentSchema);
const Leave = mongoose.model('Leave', leaveSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
    Employee,
    Department,
    Leave,
    Attendance
};