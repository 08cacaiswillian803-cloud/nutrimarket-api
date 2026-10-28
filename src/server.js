const dotenv = require('dotenv');
const entorno = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${entorno}` });
const conectarDB = require('./config/database');
const app = require('./app');
const puerto = process.env.PORT || 3000;
conectarDB().then(() => app.listen(puerto, () => console.log(`API en puerto ${puerto}`)))
  .catch(error => { console.error('Error al iniciar:', error.message); process.exit(1); });
