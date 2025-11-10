const express = require('express');
const leadController = require('../controllers/lead.controller');
const auth = require('../../../middleware/auth.middleware');
const { checkPermission } = require('../../../middleware/permission.middleware');

const router = express.Router();

router.use(auth);

router.get('/', checkPermission('crm:read'), leadController.getLeads);
router.post('/', checkPermission('crm:create'), leadController.createLead);
router.put('/:id', checkPermission('crm:update'), leadController.updateLead);
router.delete('/:id', checkPermission('crm:delete'), leadController.deleteLead);

module.exports = router;