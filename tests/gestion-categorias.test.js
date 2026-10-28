const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
// Estas pruebas usan mocks: no requieren conexión a MongoDB Atlas.
jest.mock('../src/models/Category', () => ({ find: jest.fn(), create: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }));
const Category = require('../src/models/Category');
app.use('/api/categorias', require('../src/routes/categoryRoutes'));
test('GET devuelve categorías', async () => {
  Category.find.mockResolvedValue([{ nombre: 'Granos' }]);
  const res = await request(app).get('/api/categorias');
  expect(res.status).toBe(200);
  expect(res.body[0].nombre).toBe('Granos');
});
test('POST rechaza nombre vacío', async () => {
  const res = await request(app).post('/api/categorias').send({ nombre: '' });
  expect(res.status).toBe(400);
});
