const logger = require('../utils/logger');
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    path: req.url,
    stack: err.stack
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  // Hide details in production
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: isProduction && statusCode >= 500 ? 'Something went wrong' : err.message
  });
};

module.exports = { errorHandler };
