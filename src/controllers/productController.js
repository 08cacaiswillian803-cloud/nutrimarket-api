const mongoose = require('mongoose');
const Product = require('../models/Product');

const listar = async (req, res) => {
  try {
    const filtro = { activo: true };
    if (req.query.nombre) {
      const nombre = String(req.query.nombre).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filtro.nombre = { $regex: nombre, $options: 'i' };
    }
    if (req.query.categoria) {
      if (!mongoose.isValidObjectId(req.query.categoria)) return res.status(400).json({ mensaje: 'Categoría inválida' });
      filtro.categoria = req.query.categoria;
    }
    res.json(await Product.find(filtro).populate('categoria', 'nombre'));
  } catch (error) { res.status(500).json({ mensaje: 'Error al consultar productos' }); }
};
const obtener = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido' });
    const producto = await Product.findOne({ _id: req.params.id, activo: true }).populate('categoria', 'nombre');
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) { res.status(500).json({ mensaje: 'Error al consultar producto' }); }
};
const crear = async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (error) { res.status(error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500).json({ mensaje: 'No se pudo crear el producto' }); }
};
const actualizar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido' });
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) { res.status(error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500).json({ mensaje: 'No se pudo actualizar' }); }
};
const eliminar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido' });
    const producto = await Product.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto desactivado' });
  } catch (error) { res.status(500).json({ mensaje: 'No se pudo eliminar' }); }
};
const consultarStock = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido' });
    const producto = await Product.findById(req.params.id).select('nombre stock');
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) { res.status(500).json({ mensaje: 'Error al consultar inventario' }); }
};
const ajustarStock = async (req, res) => {
  try {
    const { cantidad } = req.body;
    if (!mongoose.isValidObjectId(req.params.id) || !Number.isInteger(cantidad) || cantidad === 0) return res.status(400).json({ mensaje: 'ID o cantidad inválida' });
    const producto = await Product.findOneAndUpdate(
      { _id: req.params.id, activo: true, stock: { $gte: Math.max(0, -cantidad) } },
      { $inc: { stock: cantidad } }, { new: true, runValidators: true }
    );
    if (!producto) return res.status(409).json({ mensaje: 'Producto inexistente o stock insuficiente' });
    res.json(producto);
  } catch (error) { res.status(500).json({ mensaje: 'No se pudo ajustar inventario' }); }
};
module.exports = { listar, obtener, crear, actualizar, eliminar, consultarStock, ajustarStock };
