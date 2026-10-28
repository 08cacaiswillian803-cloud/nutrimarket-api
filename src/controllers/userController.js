const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const getMe = asyncHandler(async (req, res) => res.json({ user: req.user }));
const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (!Object.keys(updates).length) throw new AppError('Envía al menos name o phone; no se permite modificar correo, rol o estado aquí', 422, 'NO_VALID_FIELDS');
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ message: 'Perfil actualizado', user });
});
const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1), limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const filter = req.query.role ? { role: req.query.role } : {};
  const [users, total] = await Promise.all([User.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit), User.countDocuments(filter)]);
  res.json({ data: users, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
});
const setUserActive = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true, runValidators: true });
  if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
  res.json({ message: 'Estado actualizado', user });
});
module.exports = { getMe, updateMe, listUsers, setUserActive };
