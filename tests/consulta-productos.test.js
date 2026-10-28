const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
// Estas pruebas usan mocks: no requieren conexión a MongoDB Atlas.
jest.mock('../src/models/Product', () => ({ find: jest.fn(), findOne: jest.fn() }));
const Product = require('../src/models/Product');
app.use('/api/productos', require('../src/routes/productRoutes'));
test('GET /api/productos devuelve productos', async () => {
  Product.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([{ nombre: 'Avena' }]) });
  const res = await request(app).get('/api/productos');
  expect(res.status).toBe(200);
  expect(res.body[0].nombre).toBe('Avena');
});
test('GET /api/productos/:id valida ID', async () => {
  const res = await request(app).get('/api/productos/invalido');
  expect(res.status).toBe(400);
});
