const ActionItemModel = require('../models/actionItem.model');

class ActionItemService {
  static async createActionItem(task, assignee, meetingId, dueDate) {
    return await ActionItemModel.create(task, assignee, meetingId, dueDate);
  }

  static async updateActionItemStatus(id, status) {
    await ActionItemModel.updateStatus(id, status);
  }

  static async getActionItems(filters) {
    return await ActionItemModel.find(filters);
  }

  static async getOverdueActionItems() {
    const now = new Date().toISOString();
    return await ActionItemModel.findOverdue(now);
  }
}

module.exports = ActionItemService;
