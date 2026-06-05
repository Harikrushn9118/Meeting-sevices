const { prisma } = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

class MeetingModel {
  static async create(title, participants, meetingDate, transcriptJsonStr, createdBy) {
    const participantsStr = JSON.stringify(participants || []);
    const transcriptStr = JSON.stringify(transcriptJsonStr || []);
    const dateObj = new Date(meetingDate);

    const meeting = await prisma.meeting.create({
      data: {
        id: uuidv4(),
        title,
        participants: participantsStr,
        meetingDate: dateObj,
        transcript: transcriptStr,
        createdBy
      }
    });

    return {
      id: meeting.id,
      title: meeting.title,
      participants: JSON.parse(meeting.participants),
      meetingDate: meeting.meetingDate
    };
  }

  static async find(page, limit) {
    const offset = (page - 1) * limit;
    
    const [total, data] = await prisma.$transaction([
      prisma.meeting.count(),
      prisma.meeting.findMany({
        skip: offset,
        take: limit,
        orderBy: { meetingDate: 'desc' }
      })
    ]);

    return { total, data };
  }

  static async findById(id) {
    return await prisma.meeting.findUnique({
      where: { id }
    });
  }

  static async saveAnalysis(meetingId, analysis) {
    const data = {
      summary: JSON.stringify(analysis.summary || []),
      actionItems: JSON.stringify(analysis.actionItems || []),
      decisions: JSON.stringify(analysis.decisions || []),
      followUpSuggestions: JSON.stringify(analysis.followUpSuggestions || []),
      analyzedAt: new Date()
    };

    await prisma.meetingAnalysis.upsert({
      where: { meetingId },
      update: data,
      create: {
        id: uuidv4(),
        meetingId,
        ...data
      }
    });
  }

  static async getAnalysis(meetingId) {
    return await prisma.meetingAnalysis.findUnique({
      where: { meetingId }
    });
  }
}

module.exports = MeetingModel;
