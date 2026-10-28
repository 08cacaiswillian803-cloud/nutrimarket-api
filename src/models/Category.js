const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, unique: true },
  descripcion: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
