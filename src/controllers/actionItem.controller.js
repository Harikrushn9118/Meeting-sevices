const ActionItemService = require('../services/actionItem.service');
const { success, error } = require('../utils/response.util');

class ActionItemController {
  static async create(req, res, next) {
    try {
      const { task, assignee, meetingId, dueDate } = req.body;
      const result = await ActionItemService.createActionItem(task, assignee, meetingId, dueDate);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json(error('VALIDATION_ERROR', 'Invalid status value'));
      }

      await ActionItemService.updateActionItemStatus(id, status);
      res.json(success({ id, status }));
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const { status, assignee, meetingId } = req.query;
      const items = await ActionItemService.getActionItems({ status, assignee, meetingId });
      res.json(success(items));
    } catch (err) {
      next(err);
    }
  }

  static async getOverdue(req, res, next) {
    try {
      const items = await ActionItemService.getOverdueActionItems();
      res.json(success(items));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ActionItemController;
