const mongoose = require('mongoose');
async function conectarDB() {
  if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI en las variables de entorno');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB conectado');
}
module.exports = conectarDB;
