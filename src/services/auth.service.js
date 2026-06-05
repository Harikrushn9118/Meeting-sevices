const jwt = require('jsonwebtoken');
const env = require('../config/env.config');
const UserModel = require('../models/user.model');

class AuthService {
  static async register(username, password) {
    return await UserModel.create(username, password);
  }

  static async login(username, password) {
    const user = await UserModel.findByUsernameAndPassword(username, password);
    if (!user) return null;
    const token = jwt.sign({ id: user.id, username: user.username }, env.jwtSecret);
    return token;
  }
}

module.exports = AuthService;
