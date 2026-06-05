const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const env = require('./env.config');

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  
  dbInstance = await open({
    filename: env.dbPath,
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      participants TEXT,
      meetingDate TEXT,
      transcript TEXT
    );

    CREATE TABLE IF NOT EXISTS action_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      assignee TEXT,
      meetingId INTEGER,
      dueDate TEXT,
      status TEXT DEFAULT 'PENDING'
    );

    CREATE TABLE IF NOT EXISTS meeting_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meetingId INTEGER UNIQUE,
      summary TEXT,
      actionItems TEXT,
      decisions TEXT,
      followUpSuggestions TEXT,
      analyzedAt TEXT
    );
  `);

  return dbInstance;
}

module.exports = { getDb };
