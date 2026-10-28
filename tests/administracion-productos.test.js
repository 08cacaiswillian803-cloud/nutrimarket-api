const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
// Estas pruebas usan mocks: no requieren conexión a MongoDB Atlas.
jest.mock('../src/models/Product', () => ({ create: jest.fn(), findByIdAndUpdate: jest.fn() }));
const Product = require('../src/models/Product');
app.use('/api/productos', require('../src/routes/productRoutes'));
const producto = { nombre: 'Avena', precio: 5000, stock: 4, categoria: '507f1f77bcf86cd799439011' };
test('POST crea producto válido', async () => {
  Product.create.mockResolvedValue(producto);
  const res = await request(app).post('/api/productos').send(producto);
  expect(res.status).toBe(201);
});
test('POST rechaza precio negativo', async () => {
  const res = await request(app).post('/api/productos').send({ ...producto, precio: -1 });
  expect(res.status).toBe(400);
});
