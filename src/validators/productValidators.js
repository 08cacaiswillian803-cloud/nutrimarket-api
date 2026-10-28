const validarProducto = (req, res, next) => {
  const { nombre, precio, stock, categoria } = req.body;
  if (typeof nombre !== 'string' || !nombre.trim() ||
      typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0 ||
      !Number.isInteger(stock) || stock < 0 ||
      typeof categoria !== 'string' || !/^[a-f\d]{24}$/i.test(categoria)) {
    return res.status(400).json({ mensaje: 'Datos de producto inválidos' });
  }
  next();
};
module.exports = { validarProducto };
