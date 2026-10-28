const mongoose = require('mongoose');

async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('Falta MONGODB_URI. Copia .env.example a .env y configura MongoDB Atlas.');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
  return mongoose.connection;
}
module.exports = { connectDB };
