const Lead = require('../models/lead.model');
const logger = require('../../../config/logger');

exports.getLeads = async (req, res) => {
    try {
        const filter = req.user.organizationId ? 
            { organizationId: req.user.organizationId } : 
            { assignedTo: req.user.userId };
            
        const leads = await Lead.find(filter)
            .populate('assignedTo', 'username email')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: leads
        });
    } catch (error) {
        logger.error('Get leads error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leads'
        });
    }
};

exports.createLead = async (req, res) => {
    try {
        const leadData = {
            ...req.body,
            organizationId: req.user.organizationId || null,
            assignedTo: req.body.assignedTo || req.user.userId
        };

        const lead = new Lead(leadData);
        await lead.save();
        await lead.populate('assignedTo', 'username email');

        logger.info(`Lead created: ${lead._id} by user: ${req.user.userId}`);
        
        res.status(201).json({
            success: true,
            message: 'Lead created successfully',
            data: lead
        });
    } catch (error) {
        logger.error('Create lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating lead'
        });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findOneAndUpdate(
            { _id: req.params.id, organizationId: req.user.organizationId },
            req.body,
            { new: true }
        ).populate('assignedTo', 'username email');

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        res.json({
            success: true,
            message: 'Lead updated successfully',
            data: lead
        });
    } catch (error) {
        logger.error('Update lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating lead'
        });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.user.organizationId
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        res.json({
            success: true,
            message: 'Lead deleted successfully'
        });
    } catch (error) {
        logger.error('Delete lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting lead'
        });
    }
};