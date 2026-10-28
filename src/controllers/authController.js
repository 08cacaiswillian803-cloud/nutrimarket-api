const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../services/tokenService');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.exists({ email: String(email).toLowerCase().trim() });
  if (exists) throw new AppError('Ya existe una cuenta con ese correo', 409, 'EMAIL_IN_USE');
  const user = await User.create({ name, email, password, phone, role: 'client' });
  res.status(201).json({ message: 'Cuenta creada', token: signToken(user), user });
});
const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email).toLowerCase().trim();
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.active || !(await user.comparePassword(req.body.password))) throw new AppError('Correo o contraseña incorrectos', 401, 'INVALID_CREDENTIALS');
  res.json({ message: 'Inicio de sesión correcto', token: signToken(user), user: user.toJSON() });
});
const me = asyncHandler(async (req, res) => res.json({ user: req.user }));
module.exports = { register, login, me };
