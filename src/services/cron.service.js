const cron = require('node-cron');
const ActionItemService = require('./actionItem.service');
const env = require('../config/env.config');
const Logger = require('../utils/logger.util');

class CronService {
  static init() {
    cron.schedule('* * * * *', async () => {
      try {
        const overdueItems = await ActionItemService.getOverdueActionItems();
        
        for (let item of overdueItems) {
          if (env.webhookUrl) {
            await fetch(env.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `Reminder: ${item.task}\nAssigned To: ${item.assignee}\nDue Date: ${item.dueDate}`
              })
            });
          }
          Logger.info(`Reminder checked/sent for item ${item.id}`);
        }
      } catch (err) {
        Logger.error('Cron job error:', err);
      }
    });
    Logger.info('Cron job scheduler initialized.');
  }
}

module.exports = CronService;
