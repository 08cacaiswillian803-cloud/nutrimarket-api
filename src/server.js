require('./config/env');
const app=require('./app');const {connectDB}=require('./config/db');
const PORT=Number(process.env.PORT||3000);
async function start(){try{if(process.env.NODE_ENV==='production'&&(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32))throw new Error('En producción JWT_SECRET debe tener al menos 32 caracteres.');await connectDB();const server=app.listen(PORT,()=>console.log(`NutriMarket API en http://localhost:${PORT}`));const shutdown=async(signal)=>{console.log(`${signal}: cerrando servidor...`);server.close(async()=>{const mongoose=require('mongoose');await mongoose.connection.close();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();};process.on('SIGINT',()=>shutdown('SIGINT'));process.on('SIGTERM',()=>shutdown('SIGTERM'));}catch(err){console.error(`No se pudo iniciar NutriMarket: ${err.message}`);process.exit(1);}}
if(require.main===module)start();module.exports={start};
