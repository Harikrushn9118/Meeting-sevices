const { v4: uuidv4 } = require('uuid');
const Logger = require('../utils/logger.util');

const traceMiddleware = (req, res, next) => {
  req.traceId = req.headers['x-trace-id'] || uuidv4();
  res.setHeader('x-trace-id', req.traceId);
  
  Logger.info('Incoming request', {
    traceId: req.traceId,
    method: req.method,
    path: req.path
  });

  const originalJson = res.json;
  res.json = function(body) {
    if (body && typeof body === 'object' && !body.traceId) {
      body.traceId = req.traceId;
    }
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = traceMiddleware;
