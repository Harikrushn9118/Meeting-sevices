const { prisma } = require('../config/db.config');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class UserModel {
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    console.log("Creating user with payload:", { id, username, password: hashedPassword });
    const user = await prisma.user.create({
      data: { id, username, password: hashedPassword },
      select: { id: true, username: true }
    });
    return user;
  }

  static async findByUsername(username) {
    return await prisma.user.findFirst({
      where: { username }
    });
  }
}

module.exports = UserModel;
