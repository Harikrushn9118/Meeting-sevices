const { getDb } = require('../config/db.config');

class ActionItemModel {
  static async create(task, assignee, meetingId, dueDate) {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO action_items (task, assignee, meetingId, dueDate) VALUES (?, ?, ?, ?)',
      [task, assignee, meetingId, dueDate]
    );
    return { id: result.lastID, task, status: 'PENDING' };
  }

  static async updateStatus(id, status) {
    const db = await getDb();
    await db.run('UPDATE action_items SET status = ? WHERE id = ?', [status, id]);
  }

  static async find(filters) {
    const db = await getDb();
    let query = 'SELECT * FROM action_items WHERE 1=1';
    const params = [];
    if (filters.status) { query += ' AND status = ?'; params.push(filters.status); }
    if (filters.assignee) { query += ' AND assignee = ?'; params.push(filters.assignee); }
    if (filters.meetingId) { query += ' AND meetingId = ?'; params.push(filters.meetingId); }
    
    return await db.all(query, params);
  }

  static async findOverdue(currentDateStr) {
    const db = await getDb();
    return await db.all('SELECT * FROM action_items WHERE status != "COMPLETED" AND dueDate < ?', [currentDateStr]);
  }
}

module.exports = ActionItemModel;
