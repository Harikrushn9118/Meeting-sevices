const { getDb } = require('../config/db.config');

class UserModel {
  static async create(username, password) {
    const db = await getDb();
    const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return { id: result.lastID, username };
  }

  static async findByUsernameAndPassword(username, password) {
    const db = await getDb();
    return await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  }
}

module.exports = UserModel;
