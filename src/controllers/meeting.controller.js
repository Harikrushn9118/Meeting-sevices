const MeetingService = require('../services/meeting.service');
const AIService = require('../services/ai.service');
const { success, error } = require('../utils/response.util');

class MeetingController {
  static async createMeeting(req, res, next) {
    try {
      const { title, participants, meetingDate, transcript } = req.body;
      const result = await MeetingService.createMeeting(title, participants, meetingDate, transcript);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  static async listMeetings(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const meetings = await MeetingService.getMeetings(page, limit);
      res.json(success(meetings));
    } catch (err) {
      next(err);
    }
  }

  static async getMeeting(req, res, next) {
    try {
      const meeting = await MeetingService.getMeetingById(req.params.id);
      if (!meeting) {
        return res.status(404).json(error('NOT_FOUND', 'Meeting not found'));
      }
      res.json(success(meeting));
    } catch (err) {
      next(err);
    }
  }

  static async analyzeMeeting(req, res, next) {
    try {
      const meeting = await MeetingService.getMeetingById(req.params.id);
      if (!meeting) {
        return res.status(404).json(error('NOT_FOUND', 'Meeting not found'));
      }

      const analysis = await AIService.analyzeTranscript(meeting.transcript);

      await MeetingService.saveAnalysis(meeting.id, analysis);

      res.json(success(analysis));
    } catch (err) {
      next(err);
    }
  }

  static async getAnalysis(req, res, next) {
    try {
      const analysis = await MeetingService.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json(error('NOT_FOUND', 'No analysis found for this meeting. Run POST /api/meetings/:id/analyze first.'));
      }
      res.json(success(analysis));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MeetingController;
