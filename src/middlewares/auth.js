const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) throw new AppError('Se requiere un token Bearer', 401, 'AUTH_REQUIRED');
  const token = authorization.slice(7).trim();
  if (!token) throw new AppError('Se requiere un token Bearer', 401, 'AUTH_REQUIRED');
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret-key-at-least-32-characters' : 'development-secret-change-before-deploy'), { issuer: 'nutrimarket-api', audience: 'nutrimarket-client' }); }
  catch { throw new AppError('Token inválido o expirado', 401, 'INVALID_TOKEN'); }
  const user = await User.findById(payload.sub);
  if (!user || !user.active) throw new AppError('La cuenta no existe o está desactivada', 401, 'USER_INACTIVE');
  req.user = user;
  next();
});
function restrictTo(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(new AppError('No tienes permisos para esta acción', 403, 'FORBIDDEN'));
    next();
  };
}
module.exports = { protect, restrictTo };
