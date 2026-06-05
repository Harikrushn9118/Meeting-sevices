const { error } = require('../utils/response.util');

const validate = (schema) => {
  return (req, res, next) => {
    for (const [field, type] of Object.entries(schema)) {
      if (!req.body[field]) {
        return res.status(400).json(error('VALIDATION_ERROR', `Missing required field: ${field}`));
      }
    }
    next();
  };
};

module.exports = { validate };
