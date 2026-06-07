const ActionItemService = require('../services/actionItem.service');
const { success, error } = require('../utils/response.util');

class ActionItemController {
  static async create(req, res, next) {
    try {
      const { task, assignee, meetingId, dueDate } = req.body;
      const result = await ActionItemService.createActionItem(task, assignee, meetingId, dueDate);
      res.json(success(result, res.locals.traceId));
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
        return res.status(400).json(error('VALIDATION_ERROR', 'Invalid status value', res.locals.traceId));
      }

      await ActionItemService.updateActionItemStatus(id, status);
      res.json(success({ id, status }, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const { status, assignee, meetingId } = req.query;
      const items = await ActionItemService.getActionItems({ status, assignee, meetingId });
      res.json(success(items, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async getOverdue(req, res, next) {
    try {
      const items = await ActionItemService.getOverdueActionItems();
      res.json(success(items, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }

  static async triggerReminders(req, res, next) {
    try {
      const { prisma } = require('../config/db.config');
      const env = require('../config/env.config');
      const { v4: uuidv4 } = require('uuid');
      
      const overdueItems = await ActionItemService.getOverdueActionItems();
      let sentCount = 0;
      
      for (let item of overdueItems) {
        const alreadySent = await prisma.reminderLog.findFirst({
          where: { actionItemId: item.id }
        });

        if (!alreadySent) {
          if (env.webhookUrl) {
            await fetch(env.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `Reminder: ${item.task}\nAssigned To: ${item.assignee}\nDue Date: ${item.dueDate}`
              })
            });
          }
          await prisma.reminderLog.create({
            data: { id: uuidv4(), actionItemId: item.id }
          });
          sentCount++;
        }
      }
      res.json(success({ message: `Successfully triggered and sent ${sentCount} reminders via Discord Webhook.` }, res.locals.traceId));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ActionItemController;
