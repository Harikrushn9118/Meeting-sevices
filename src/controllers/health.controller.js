const { success } = require('../utils/response.util');

class HealthController {
  static getHealth(req, res) {
    res.json(success({ status: 'UP' }, res.locals.traceId));
  }

  static getEvaluation(req, res) {
    res.json(success({
      candidateName: "Harikrushn Patel",
      email: "harikrushn@example.com",
      repositoryUrl: "https://github.com/Harikrushn9118/Meeting-sevices",
      deployedUrl: "https://example.com",
      externalIntegration: "Slack Webhook",
      features: [
        "Authentication",
        "AI Analysis",
        "Reminder Scheduler"
      ]
    }, res.locals.traceId));
  }
}

module.exports = HealthController;
