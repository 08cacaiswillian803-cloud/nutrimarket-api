const mongoose = require('mongoose');
const Product = require('../models/Product');
// Descuenta inventario al confirmar una orden; requiere transacciones habilitadas en Atlas.
async function descontarInventario(items, session) {
  if (!Array.isArray(items) || !items.length) throw new Error('La orden debe tener productos');
  for (const item of items) {
    if (!mongoose.isValidObjectId(item.productoId) || !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
      throw new Error('Producto o cantidad inválidos');
    }
    const producto = await Product.findOneAndUpdate(
      { _id: item.productoId, activo: true, stock: { $gte: item.cantidad } },
      { $inc: { stock: -item.cantidad } },
      { new: true, session }
    );
    if (!producto) throw new Error('Stock insuficiente o producto inexistente');
  }
}
async function reservarInventario(items) {
  const session = await mongoose.startSession();
  try { await session.withTransaction(() => descontarInventario(items, session)); }
  finally { await session.endSession(); }
}
module.exports = { descontarInventario, reservarInventario };
