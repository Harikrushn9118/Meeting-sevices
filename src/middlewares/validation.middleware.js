const { error } = require('../utils/response.util');

const validate = (schema) => {
  return (req, res, next) => {
    for (const [field, type] of Object.entries(schema)) {
      const value = req.body[field];
      
      if (value === undefined || value === null) {
        return res.status(400).json(error('VALIDATION_ERROR', `Missing required field: ${field}`, res.locals.traceId));
      }

      if (type === 'string' && typeof value !== 'string') {
        return res.status(400).json(error('VALIDATION_ERROR', `Field ${field} must be a string`, res.locals.traceId));
      }
      
      if (type === 'array' && !Array.isArray(value)) {
        return res.status(400).json(error('VALIDATION_ERROR', `Field ${field} must be an array`, res.locals.traceId));
      }

      if (type === 'date' && isNaN(Date.parse(value))) {
        return res.status(400).json(error('VALIDATION_ERROR', `Field ${field} must be a valid date`, res.locals.traceId));
      }
    }
    next();
  };
};

module.exports = { validate };
