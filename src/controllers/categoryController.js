const mongoose = require('mongoose');
const Category = require('../models/Category');
const listar = async (req, res) => {
  try { res.json(await Category.find()); }
  catch (error) { res.status(500).json({ mensaje: 'Error al consultar categorías' }); }
};
const crear = async (req, res) => {
  try { res.status(201).json(await Category.create(req.body)); }
  catch (error) { res.status(error.code === 11000 || error.name === 'ValidationError' ? 400 : 500).json({ mensaje: 'No se pudo crear la categoría' }); }
};
const actualizar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido' });
    const categoria = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) { res.status(error.code === 11000 || error.name === 'ValidationError' ? 400 : 500).json({ mensaje: 'No se pudo actualizar' }); }
};
const eliminar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido' });
    // Evita dejar productos con una categoría inexistente.
    const Product = require('../models/Product');
    if (await Product.exists({ categoria: req.params.id })) return res.status(409).json({ mensaje: 'La categoría tiene productos asociados' });
    const categoria = await Category.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error) { res.status(500).json({ mensaje: 'No se pudo eliminar' }); }
};
module.exports = { listar, crear, actualizar, eliminar };
