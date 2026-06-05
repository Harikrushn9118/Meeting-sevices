const Logger = require('../utils/logger.util');
const { error } = require('../utils/response.util');

const errorMiddleware = (err, req, res, next) => {
  const traceId = res.locals.traceId || req.traceId;
  Logger.error(err.message || 'Unhandled Exception', { traceId, stack: err.stack });
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(error('UNAUTHORIZED', 'Invalid token', traceId));
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';
  
  res.status(statusCode).json(error(code, message, traceId));
};

module.exports = errorMiddleware;
