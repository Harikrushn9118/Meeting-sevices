const { v4: uuidv4 } = require('uuid');
const Logger = require('../utils/logger.util');

const traceMiddleware = (req, res, next) => {
  const traceId = req.headers['x-trace-id'] || uuidv4();
  req.traceId = traceId;
  res.locals.traceId = traceId;
  res.setHeader('x-trace-id', traceId);
  
  Logger.info('Incoming request', {
    traceId,
    method: req.method,
    path: req.path
  });
  
  next();
};

module.exports = traceMiddleware;
