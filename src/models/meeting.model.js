const { getDb } = require('../config/db.config');

class MeetingModel {
  static async create(title, participants, meetingDate, transcriptJsonStr) {
    const db = await getDb();
    const participantsStr = JSON.stringify(participants || []);
    const result = await db.run(
      'INSERT INTO meetings (title, participants, meetingDate, transcript) VALUES (?, ?, ?, ?)',
      [title, participantsStr, meetingDate, transcriptJsonStr]
    );
    return { id: result.lastID, title, participants: participants || [], meetingDate };
  }

  static async findAll(limit, offset) {
    const db = await getDb();
    return await db.all('SELECT id, title, meetingDate FROM meetings LIMIT ? OFFSET ?', [limit, offset]);
  }

  static async findById(id) {
    const db = await getDb();
    return await db.get('SELECT * FROM meetings WHERE id = ?', [id]);
  }

  static async saveAnalysis(meetingId, analysis) {
    const db = await getDb();
    await db.run(
      `INSERT OR REPLACE INTO meeting_analysis (meetingId, summary, actionItems, decisions, followUpSuggestions, analyzedAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        meetingId,
        JSON.stringify(analysis.summary),
        JSON.stringify(analysis.actionItems),
        JSON.stringify(analysis.decisions),
        JSON.stringify(analysis.followUpSuggestions),
        new Date().toISOString()
      ]
    );
  }

  static async getAnalysis(meetingId) {
    const db = await getDb();
    return await db.get('SELECT * FROM meeting_analysis WHERE meetingId = ?', [meetingId]);
  }
}

module.exports = MeetingModel;
