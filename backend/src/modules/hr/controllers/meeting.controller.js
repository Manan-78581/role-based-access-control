const Meeting = require('../models/meeting.model');

exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ organizationId: req.user.organizationId })
            .populate('projectId', 'name')
            .populate('createdBy', 'username email')
            .sort({ meetingDate: 1 });
        
        res.json({
            success: true,
            data: meetings
        });
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching meetings'
        });
    }
};

exports.createMeeting = async (req, res) => {
    try {
        const meetingData = {
            ...req.body,
            organizationId: req.user.organizationId,
            createdBy: req.user.userId
        };

        const meeting = new Meeting(meetingData);
        await meeting.save();
        await meeting.populate(['projectId', 'createdBy']);

        res.status(201).json({
            success: true,
            message: 'Meeting scheduled successfully',
            data: meeting
        });
    } catch (error) {
        console.error('Create meeting error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating meeting'
        });
    }
};

exports.updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndUpdate(
            { _id: req.params.id, organizationId: req.user.organizationId },
            req.body,
            { new: true }
        ).populate(['projectId', 'createdBy']);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        res.json({
            success: true,
            message: 'Meeting updated successfully',
            data: meeting
        });
    } catch (error) {
        console.error('Update meeting error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating meeting'
        });
    }
};

exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.user.organizationId
        });

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        res.json({
            success: true,
            message: 'Meeting deleted successfully'
        });
    } catch (error) {
        console.error('Delete meeting error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting meeting'
        });
    }
};
