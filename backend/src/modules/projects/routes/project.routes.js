const express = require('express');
const projectController = require('../controllers/project.controller');
const auth = require('../../../middleware/auth.middleware');
const { checkPermission } = require('../../../middleware/permission.middleware');

const router = express.Router();

router.use(auth);

router.get('/', checkPermission('projects:read'), projectController.getProjects);
router.post('/', checkPermission('projects:create'), projectController.createProject);
router.put('/:id', checkPermission('projects:update'), projectController.updateProject);
router.delete('/:id', checkPermission('projects:delete'), projectController.deleteProject);
router.get('/:id/updates', checkPermission('projects:read'), projectController.getProjectUpdates);
router.post('/:id/updates', checkPermission('projects:create'), projectController.createProjectUpdate);

module.exports = router;