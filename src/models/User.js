const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: [true, 'El correo es obligatorio'], unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  phone: { type: String, trim: true, maxlength: 25, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });
userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function (candidate) { return bcrypt.compare(candidate, this.password); };
userSchema.methods.toJSON = function () {
  const obj = this.toObject(); delete obj.password; delete obj.__v; return obj;
};
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
