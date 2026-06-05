require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  geminiApiKey: process.env.GEMINI_API_KEY || 'dummy_key',
  webhookUrl: process.env.WEBHOOK_URL,
  dbPath: './database.sqlite'
};
