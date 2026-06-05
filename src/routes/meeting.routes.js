const express = require('express');
const MeetingController = require('../controllers/meeting.controller');
const auth = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(auth);

router.post('/', validate({ title: 'string', transcript: 'object', meetingDate: 'date', participants: 'array' }), MeetingController.createMeeting);
router.get('/', MeetingController.listMeetings);
router.get('/:id', MeetingController.getMeeting);
router.post('/:id/analyze', MeetingController.analyzeMeeting);
router.get('/:id/analysis', MeetingController.getAnalysis);

module.exports = router;
