const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/productos', require('./routes/productRoutes'));
app.use('/api/categorias', require('./routes/categoryRoutes'));
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
module.exports = app;
