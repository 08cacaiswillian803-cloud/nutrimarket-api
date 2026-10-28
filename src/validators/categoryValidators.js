const validarCategoria = (req, res, next) => {
  if (typeof req.body.nombre !== 'string' || !req.body.nombre.trim()) {
    return res.status(400).json({ mensaje: 'Nombre de categoría obligatorio' });
  }
  next();
};
module.exports = { validarCategoria };
