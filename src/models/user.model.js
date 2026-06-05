const { prisma } = require('../config/db.config');

const bcrypt = require('bcryptjs');

class UserModel {
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
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
