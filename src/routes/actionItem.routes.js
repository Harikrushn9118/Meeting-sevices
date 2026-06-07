const express = require('express');
const ActionItemController = require('../controllers/actionItem.controller');
const auth = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(auth); 

router.post('/', validate({ task: 'string', dueDate: 'string' }), ActionItemController.create);
router.get('/', ActionItemController.list);
router.get('/overdue', ActionItemController.getOverdue);
router.post('/trigger-reminders', ActionItemController.triggerReminders);
router.patch('/:id/status', validate({ status: 'string' }), ActionItemController.updateStatus);

module.exports = router;
