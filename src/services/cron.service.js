const cron = require('node-cron');
const ActionItemService = require('./actionItem.service');
const env = require('../config/env.config');
const Logger = require('../utils/logger.util');

class CronService {
  static init() {
    cron.schedule('0 * * * *', async () => {
      try {
        const { prisma } = require('../config/db.config');
        const overdueItems = await ActionItemService.getOverdueActionItems();
        
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
            const { v4: uuidv4 } = require('uuid');
            await prisma.reminderLog.create({
              data: { id: uuidv4(), actionItemId: item.id }
            });
            Logger.info(`Reminder checked/sent for item ${item.id}`);
          }
        }
      } catch (err) {
        Logger.error('Cron job error:', err);
      }
    });
    Logger.info('Cron job scheduler initialized.');
  }
}

module.exports = CronService;
