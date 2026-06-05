const jwt = require('jsonwebtoken');
const env = require('../config/env.config');
const { error } = require('../utils/response.util');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json(error('UNAUTHORIZED', 'No token provided'));
  }
  
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(error('UNAUTHORIZED', 'Invalid token'));
  }
};

module.exports = authMiddleware;
