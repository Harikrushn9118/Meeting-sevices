const MeetingModel = require('../models/meeting.model');

class MeetingService {
  static async createMeeting(title, participants, meetingDate, transcript) {
    const transcriptStr = JSON.stringify(transcript);
    return await MeetingModel.create(title, participants, meetingDate, transcriptStr);
  }

  static async getMeetings(page = 1, limit = 10) {
    const { total, data } = await MeetingModel.find(page, limit);
    return {
      data,
      meta: { total, page, limit }
    };
  }

  static async getMeetingById(id) {
    const meeting = await MeetingModel.findById(id);
    if (meeting) {
      meeting.transcript = JSON.parse(meeting.transcript);
      meeting.participants = JSON.parse(meeting.participants || '[]');
    }
    return meeting;
  }

  static async saveAnalysis(meetingId, analysis) {
    await MeetingModel.saveAnalysis(meetingId, analysis);
  }

  static async getAnalysis(meetingId) {
    const row = await MeetingModel.getAnalysis(meetingId);
    if (!row) return null;
    return {
      meetingId: row.meetingId,
      summary: JSON.parse(row.summary),
      actionItems: JSON.parse(row.actionItems),
      decisions: JSON.parse(row.decisions),
      followUpSuggestions: JSON.parse(row.followUpSuggestions),
      analyzedAt: row.analyzedAt
    };
  }
}

module.exports = MeetingService;
