const AuthService = require('../services/auth.service');
const { success, error } = require('../utils/response.util');

class AuthController {
  static async register(req, res, next) {
    try {
      console.log('AuthController.register called with body:', req.body);
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      console.log('AuthController.register user created:', user);
      res.json(success({ message: 'User registered successfully', user }, res.locals.traceId));
    } catch (err) {
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(400).json(error('DB_ERROR', 'Username already exists', res.locals.traceId));
      }
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(success(result, res.locals.traceId));
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        return res.status(401).json(error('AUTH_ERROR', 'Invalid credentials', res.locals.traceId));
      }
      next(err);
    }
  }
}

module.exports = AuthController;
