const { prisma } = require('../config/db.config');

class UserModel {
  static async create(username, password) {
    const user = await prisma.user.create({
      data: { username, password },
      select: { id: true, username: true } // Do not return password
    });
    return user;
  }

  static async findByUsernameAndPassword(username, password) {
    return await prisma.user.findFirst({
      where: { username, password }
    });
  }
}

module.exports = UserModel;
