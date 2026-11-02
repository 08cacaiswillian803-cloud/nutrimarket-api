// Servidor efímero para CI: replica set de MongoDB en memoria + datos de demo.
// No usar como servidor de producción.
require('../config/env');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

(async () => {
  let replSet, server;
  try {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-at-least-32-characters';
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 }, binary: { version: process.env.MONGOMS_VERSION || '7.0.14' } });
    await mongoose.connect(replSet.getUri('nutrimarket_ci'));
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nutrimarket.test').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin12345!';
    const clientEmail = (process.env.DEMO_CLIENT_EMAIL || 'cliente@nutrimarket.test').toLowerCase();
    const clientPassword = process.env.DEMO_CLIENT_PASSWORD || 'Cliente123!';
    await User.create({ name: 'Admin NutriMarket', email: adminEmail, password: adminPassword, role: 'admin' });
    await User.create({ name: 'Cliente Demo', email: clientEmail, password: clientPassword, role: 'client' });
    const protein = await Category.create({ name: 'Proteínas', slug: 'proteinas', description: 'Categoría demo' });
    const drinks = await Category.create({ name: 'Bebidas saludables', slug: 'bebidas-saludables', description: 'Categoría demo' });
    const snacks = await Category.create({ name: 'Snacks saludables', slug: 'snacks-saludables', description: 'Categoría demo' });
    await Product.create([
      { sku: 'NM-CI-WHEY', name: 'Proteína Whey Demo', category: protein._id, price: 129900, stock: 100 },
      { sku: 'NM-CI-DRINK', name: 'Bebida Proteica Demo', category: drinks._id, price: 8900, stock: 150 },
      { sku: 'NM-CI-SNACK', name: 'Barra de Avena Demo', category: snacks._id, price: 4500, stock: 200 }
    ]);
    server = app.listen(Number(process.env.PORT || 3000), () => console.log('CI API disponible en puerto ' + (process.env.PORT || 3000)));
    const shutdown = async () => {
      if (server) await new Promise(resolve => server.close(resolve));
      await mongoose.disconnect();
      if (replSet) await replSet.stop();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('No se pudo iniciar CI API:', error);
    if (mongoose.connection.readyState) await mongoose.disconnect().catch(() => {});
    if (replSet) await replSet.stop().catch(() => {});
    process.exit(1);
  }
})();
