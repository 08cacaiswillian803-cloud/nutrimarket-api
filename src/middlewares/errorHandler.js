const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}
function errorHandler(err, req, res, _next) {
  let error = err;
  if (err && err.name === 'ValidationError') {
    error = new AppError(Object.values(err.errors).map(e => e.message).join('; '), 400, 'VALIDATION_ERROR');
  } else if (err && err.name === 'CastError') {
    error = new AppError('Identificador no válido', 400, 'INVALID_ID');
  } else if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'dato';
    error = new AppError(`Ya existe un registro con ese ${field}`, 409, 'DUPLICATE_RESOURCE');
  } else if (!(err instanceof AppError)) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    error = new AppError('Error interno del servidor', 500, 'INTERNAL_ERROR');
  }
  const payload = { error: { code: error.code || 'ERROR', message: error.message || 'Error' } };
  if (error.details) payload.error.details = error.details;
  if (process.env.NODE_ENV === 'development' && error.statusCode >= 500) payload.error.requestId = req.headers['x-request-id'] || undefined;
  res.status(error.statusCode || 500).json(payload);
}
module.exports = { notFound, errorHandler };
