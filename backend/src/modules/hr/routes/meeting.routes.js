const express = require('express');
const meetingController = require('../controllers/meeting.controller');
const auth = require('../../../middleware/auth.middleware');
const { checkPermission } = require('../../../middleware/permission.middleware');

const router = express.Router();

router.use(auth);

router.get('/', checkPermission('hr:read'), meetingController.getMeetings);
router.post('/', checkPermission('hr:create'), meetingController.createMeeting);
router.put('/:id', checkPermission('hr:update'), meetingController.updateMeeting);
router.delete('/:id', checkPermission('hr:delete'), meetingController.deleteMeeting);

module.exports = router;
