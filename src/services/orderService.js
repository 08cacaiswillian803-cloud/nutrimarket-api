const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');

async function createOrder(userId, requestedItems) {
  if (!Array.isArray(requestedItems) || requestedItems.length < 1 || requestedItems.length > 50) throw new AppError('La orden debe incluir entre 1 y 50 productos', 422, 'INVALID_ITEMS');
  const totals = new Map();
  for (const item of requestedItems) {
    if (!item || !mongoose.isValidObjectId(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new AppError('Cada producto debe tener un productId válido y una cantidad entera entre 1 y 100', 422, 'INVALID_ORDER_ITEM');
    const key = String(item.productId); totals.set(key, (totals.get(key) || 0) + item.quantity);
  }
  for (const quantity of totals.values()) if (quantity > 100) throw new AppError('La cantidad acumulada por producto no puede superar 100', 422, 'INVALID_QUANTITY');
  const session = await mongoose.startSession();
  let created;
  try {
    await session.withTransaction(async () => {
      const ids = [...totals.keys()];
      const products = await Product.find({ _id: { $in: ids }, active: true }).session(session);
      if (products.length !== ids.length) throw new AppError('Uno o más productos no existen o están desactivados', 422, 'PRODUCT_UNAVAILABLE');
      const byId = new Map(products.map(p => [String(p._id), p]));
      const orderItems = []; let total = 0;
      for (const [id, quantity] of totals.entries()) {
        const p = byId.get(id);
        const result = await Product.updateOne({ _id: p._id, active: true, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { session });
        if (result.modifiedCount !== 1) throw new AppError(`Existencias insuficientes para ${p.name}`, 409, 'INSUFFICIENT_STOCK');
        const subtotal = Math.round((p.price * quantity + Number.EPSILON) * 100) / 100;
        total = Math.round((total + subtotal + Number.EPSILON) * 100) / 100;
        orderItems.push({ product: p._id, sku: p.sku, name: p.name, unitPrice: p.price, quantity, subtotal });
      }
      const [order] = await Order.create([{ user: userId, items: orderItems, total, status: 'confirmed', paymentMethod: 'simulation' }], { session });
      created = order;
    });
  } finally { await session.endSession(); }
  return created;
}
module.exports = { createOrder };
