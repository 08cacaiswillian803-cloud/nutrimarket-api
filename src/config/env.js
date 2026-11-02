// Carga de variables de entorno por ambiente.
// Orden de prioridad (la primera definición gana):
//   1. Variables ya presentes en el sistema (CI, hosting)
//   2. .env                      -> valores locales reales (ignorado por Git)
//   3. .env.<NODE_ENV>           -> valores por ambiente (development | test | production)
const path = require('path');
const dotenv = require('dotenv');

const nodeEnv = process.env.NODE_ENV || 'development';
const root = path.resolve(__dirname, '../..');

// En pruebas NO se lee .env, para no tocar nunca una base real por accidente.
if (nodeEnv !== 'test') dotenv.config({ path: path.join(root, '.env') });
dotenv.config({ path: path.join(root, `.env.${nodeEnv}`) });

if (!process.env.NODE_ENV) process.env.NODE_ENV = nodeEnv;

module.exports = { nodeEnv };
