const MeetingService = require('../services/meeting.service');
const AIService = require('../services/ai.service');
const { success, error } = require('../utils/response.util');

class MeetingController {
  static async createMeeting(req, res, next) {
    try {
      const { title, participants, meetingDate, transcript } = req.body;
      const result = await MeetingService.createMeeting(title, participants, meetingDate, transcript, req.user.id);
      res.json(success(result, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async listMeetings(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const meetings = await MeetingService.getMeetings(page, limit);
      res.json(success(meetings, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async getMeeting(req, res, next) {
    try {
      const meeting = await MeetingService.getMeetingById(req.params.id);
      if (!meeting) {
        return res.status(404).json(error('NOT_FOUND', 'Meeting not found', res.locals.traceId));
      }
      res.json(success(meeting, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async analyzeMeeting(req, res, next) {
    try {
      const meeting = await MeetingService.getMeetingById(req.params.id);
      if (!meeting) {
        return res.status(404).json(error('NOT_FOUND', 'Meeting not found', res.locals.traceId));
      }

      const analysis = await AIService.analyzeTranscript(meeting.transcript);

      await MeetingService.saveAnalysis(meeting.id, analysis);

      if (analysis.actionItems && Array.isArray(analysis.actionItems)) {
        const ActionItemModel = require('../models/actionItem.model');
        for (const ai of analysis.actionItems) {
          try {
            await ActionItemModel.create(
              ai.task || 'Unknown Task',
              ai.assignee || 'Unassigned',
              meeting.id,
              ai.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            );
          } catch (e) {
            console.error('Failed to auto-save action item:', e.message);
          }
        }
      }

      res.json(success(analysis, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async getAnalysis(req, res, next) {
    try {
      const analysis = await MeetingService.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json(error('NOT_FOUND', 'No analysis found for this meeting. Run POST /api/meetings/:id/analyze first.', res.locals.traceId));
      }
      res.json(success(analysis, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MeetingController;
