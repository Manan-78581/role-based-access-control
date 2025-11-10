const Project = require('../models/project.model');
const ProjectUpdate = require('../models/projectUpdate.model');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ organizationId: req.user.organizationId })
            .populate('manager', 'username email')
            .populate('team', 'username email')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects'
        });
    }
};

exports.createProject = async (req, res) => {
    try {
        console.log('Creating project with data:', req.body);
        console.log('User info:', req.user);
        
        const projectData = {
            ...req.body,
            organizationId: req.user.organizationId,
            manager: req.body.manager || req.user.userId
        };

        console.log('Final project data:', projectData);

        const project = new Project(projectData);
        await project.save();
        await project.populate('manager', 'username email');

        console.log('Project created successfully:', project._id);
        
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        console.error('Create project error:', error);
        console.error('Error details:', error.message);
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating project'
        });
    }
};

exports.updateProject = async (req, res) => {
    try {
        console.log('Updating project:', req.params.id);
        console.log('Update data:', req.body);
        console.log('User organizationId:', req.user.organizationId);
        
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, organizationId: req.user.organizationId },
            req.body,
            { new: true }
        ).populate('manager', 'username email');

        if (!project) {
            console.log('Project not found for update');
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        console.log('Project updated successfully:', project._id);
        res.json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        console.error('Update project error:', error);
        console.error('Error message:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating project'
        });
    }
};

exports.getProjectUpdates = async (req, res) => {
    try {
        const updates = await ProjectUpdate.find({ 
            projectId: req.params.id,
            organizationId: req.user.organizationId 
        })
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: updates
        });
    } catch (error) {
        console.error('Get project updates error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project updates'
        });
    }
};

exports.createProjectUpdate = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            projectId: req.params.id,
            createdBy: req.user.userId,
            organizationId: req.user.organizationId || null
        };

        const update = new ProjectUpdate(updateData);
        await update.save();
        await update.populate('createdBy', 'username email');

        console.log(`Project update created: ${update._id} for project: ${req.params.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Project update created successfully',
            data: update
        });
    } catch (error) {
        console.error('Create project update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project update'
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        console.log('Deleting project:', req.params.id);
        console.log('User organizationId:', req.user.organizationId);
        
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.user.organizationId
        });

        if (!project) {
            console.log('Project not found for deletion');
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        await ProjectUpdate.deleteMany({ projectId: req.params.id });
        console.log(`Project deleted: ${req.params.id} by user: ${req.user.userId}`);
        
        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        console.error('Error message:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting project'
        });
    }
};