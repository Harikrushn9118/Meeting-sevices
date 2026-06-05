const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const env = require('../config/env.config');

class AuthService {
  static async register(username, password) {
    return await UserModel.create(username, password);
  }

  static async login(username, password) {
    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: '24h' }
    );
    return { token };
  }
}

module.exports = AuthService;
