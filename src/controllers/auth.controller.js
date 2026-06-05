const AuthService = require('../services/auth.service');
const { success, error } = require('../utils/response.util');

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      res.json(success({ message: 'User registered successfully', user }));
    } catch (err) {
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(400).json(error('DB_ERROR', 'Username already exists'));
      }
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const token = await AuthService.login(username, password);
      
      if (!token) {
        return res.status(401).json(error('AUTH_ERROR', 'Invalid credentials'));
      }
      
      res.json(success({ token }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
