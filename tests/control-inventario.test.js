jest.mock('../src/models/Product', () => ({ findOneAndUpdate: jest.fn() }));
const Product = require('../src/models/Product');
const { descontarInventario } = require('../src/services/orderService');
const id = '507f1f77bcf86cd799439011';
beforeEach(() => jest.clearAllMocks());
test('descuenta cantidad cuando hay stock', async () => {
  Product.findOneAndUpdate.mockResolvedValue({ stock: 3 });
  await descontarInventario([{ productoId: id, cantidad: 2 }], {});
  expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
    expect.objectContaining({ stock: { $gte: 2 } }),
    { $inc: { stock: -2 } }, expect.any(Object)
  );
});
test('rechaza orden sin existencias', async () => {
  Product.findOneAndUpdate.mockResolvedValue(null);
  await expect(descontarInventario([{ productoId: id, cantidad: 99 }], {})).rejects.toThrow('Stock insuficiente');
});
test('rechaza cantidades negativas', async () => {
  await expect(descontarInventario([{ productoId: id, cantidad: -1 }], {})).rejects.toThrow('inválidos');
});
