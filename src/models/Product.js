const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, trim: true, uppercase: true, minlength: 3, maxlength: 40 },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  price: { type: Number, required: true, min: 0.01, max: 100000000 },
  stock: { type: Number, required: true, min: 0, validate: { validator: Number.isInteger, message: 'El stock debe ser un entero' } },
  active: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });
schema.index({ name: 'text', description: 'text' });
module.exports = mongoose.models.Product || mongoose.model('Product', schema);
