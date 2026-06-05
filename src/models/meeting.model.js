const { prisma } = require('../config/db.config');

class MeetingModel {
  static async create(title, participants, meetingDate, transcriptJsonStr) {
    const participantsStr = JSON.stringify(participants || []);
    
    const dateObj = new Date(meetingDate);

    const meeting = await prisma.meeting.create({
      data: {
        title,
        participants: participantsStr,
        meetingDate: dateObj,
        transcript: transcriptJsonStr
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
      where: { id: parseInt(id) }
    });
  }

  static async saveAnalysis(meetingId, analysis) {
    const data = {
      summary: JSON.stringify(analysis.summary),
      actionItems: JSON.stringify(analysis.actionItems),
      decisions: JSON.stringify(analysis.decisions),
      followUpSuggestions: JSON.stringify(analysis.followUpSuggestions),
      analyzedAt: new Date()
    };

    await prisma.meetingAnalysis.upsert({
      where: { meetingId: parseInt(meetingId) },
      update: data,
      create: {
        meetingId: parseInt(meetingId),
        ...data
      }
    });
  }

  static async getAnalysis(meetingId) {
    return await prisma.meetingAnalysis.findUnique({
      where: { meetingId: parseInt(meetingId) }
    });
  }
}

module.exports = MeetingModel;
