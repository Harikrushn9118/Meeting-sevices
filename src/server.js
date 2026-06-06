const env = require('./config/env.config');
const app = require('./app');
const Logger = require('./utils/logger.util');
const CronService = require('./services/cron.service');

const PORT = env.port;

app.listen(PORT, () => {
  Logger.info(`Server running on port ${PORT}`);
  
  // Initialize Background Jobs
  CronService.init();
});
