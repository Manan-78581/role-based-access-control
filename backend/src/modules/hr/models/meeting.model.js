const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    meetingDate: {
        type: Date,
        required: true
    },
    meetingTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 60
    },
    attendees: [String],
    location: String,
    meetingType: {
        type: String,
        enum: ['onboarding', 'kickoff', 'review', 'planning'],
        default: 'onboarding'
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    notes: String,
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);
