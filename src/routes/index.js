const express = require('express');
const authRoutes = require('./auth.routes');
const meetingRoutes = require('./meeting.routes');
const actionItemRoutes = require('./actionItem.routes');
const HealthController = require('../controllers/health.controller');

const router = express.Router();

router.get('/health', HealthController.getHealth);
router.get('/api/evaluation', HealthController.getEvaluation);

router.use('/api', authRoutes);
router.use('/api/meetings', meetingRoutes);
router.use('/api/action-items', actionItemRoutes);

module.exports = router;
