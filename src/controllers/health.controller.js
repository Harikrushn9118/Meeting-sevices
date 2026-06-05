class HealthController {
  static getHealth(req, res) {
    res.json({ status: 'UP' });
  }

  static getEvaluation(req, res) {
    res.json({
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
    });
  }
}

module.exports = HealthController;
