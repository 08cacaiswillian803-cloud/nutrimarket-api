# NutriMarket API — módulos unificados

Se reúnen las cuatro funcionalidades de Eiver en un solo `src`:
- Consulta de productos: `GET /api/productos`, `GET /api/productos/:id`.
- Administración: `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id` (baja lógica).
- Categorías: `GET /api/categorias`, `POST /api/categorias`, `PUT /api/categorias/:id`, `DELETE /api/categorias/:id`.
- Inventario: `GET /api/productos/:id/stock`, `PATCH /api/productos/:id/stock`; servicio `descontarInventario`/`reservarInventario` para una futura ruta de órdenes.

## Ejecutar

1. `npm install`
2. Copiar `.env.development.example` a `.env.development` y configurar una URI válida de MongoDB Atlas.
3. `npm start`
4. `npm test`

Las pruebas incluidas usan mocks y no requieren Atlas. El servicio de órdenes permite descontar inventario dentro de una transacción, pero **no incluye** endpoints de órdenes porque no formaban parte de estos cuatro entregables. Integrar autenticación y autorizaciones antes de exponer rutas administrativas públicamente.
