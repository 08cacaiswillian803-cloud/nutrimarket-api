const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');
function validateRequest(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map(({ path, msg }) => ({ field: path, message: msg }));
    return next(new AppError('Los datos enviados no son válidos', 422, 'VALIDATION_ERROR', details));
  }
  next();
}
module.exports = validateRequest;
