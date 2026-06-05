const { prisma } = require('../config/db.config');

class ActionItemModel {
  static async create(task, assignee, meetingId, dueDate) {
    if (!dueDate || isNaN(Date.parse(dueDate))) {
      throw new Error('Invalid dueDate provided');
    }
    
    const actionItem = await prisma.actionItem.create({
      data: {
        task,
        assignee,
        meetingId: parseInt(meetingId),
        dueDate: new Date(dueDate)
      }
    });
    return { id: actionItem.id, task: actionItem.task, status: actionItem.status };
  }

  static async updateStatus(id, status) {
    await prisma.actionItem.update({
      where: { id: parseInt(id) },
      data: { status }
    });
  }

  static async find(filters) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.assignee) where.assignee = filters.assignee;
    if (filters.meetingId) where.meetingId = parseInt(filters.meetingId);

    return await prisma.actionItem.findMany({
      where
    });
  }

  static async findOverdue(currentDateStr) {
    return await prisma.actionItem.findMany({
      where: {
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date(currentDateStr) }
      }
    });
  }
}

module.exports = ActionItemModel;
