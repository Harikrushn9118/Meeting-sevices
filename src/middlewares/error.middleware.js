const Logger = require('../utils/logger.util');
const { error } = require('../utils/response.util');

const errorMiddleware = (err, req, res, next) => {
  Logger.error('Unhandled Exception', { traceId: req.traceId, error: err.message, stack: err.stack });
  
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';
  
  res.status(statusCode).json(error(code, message));
};

module.exports = errorMiddleware;
