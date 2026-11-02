const mongoose = require('mongoose');
const slugify = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true, minlength: 2, maxlength: 60 },
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });
schema.pre('validate', function () { if (this.name && !this.slug) this.slug = slugify(this.name); });
module.exports = mongoose.models.Category || mongoose.model('Category', schema);
