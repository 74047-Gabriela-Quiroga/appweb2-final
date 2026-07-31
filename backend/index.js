// ============================================================
// index.js - Servidor Express Principal
// ============================================================
// Este es el punto de entrada de nuestra aplicación backend.
// Configura Express, CORS, rutas y el manejo de errores.
// ============================================================

// Cargamos las variables de entorno del archivo .env
// Esto SIEMPRE debe ir al principio del archivo
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importamos la función de conexión a la base de datos
const { connectDB } = require('./db/connection');

// Importamos las rutas de cada entidad
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const saleRoutes = require('./routes/sale.routes');

// Importamos el middleware centralizado de errores
const errorHandler = require('./middlewares/errorHandler.middleware');

// Creamos la aplicación Express
const app = express();

// ==================== MIDDLEWARES GLOBALES ====================

// cors() permite que el frontend (en otro dominio) haga peticiones al backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));

// express.json() permite leer el body de las peticiones en formato JSON
app.use(express.json());

// ==================== RUTAS ====================

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 API funcionando correctamente' });
});

// Montamos las rutas de cada entidad en su prefijo correspondiente
// Ejemplo: POST /users/register, GET /products, POST /sales/create
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);

// ==================== MANEJO DE ERRORES ====================

// Middleware de error centralizado (SIEMPRE al final de las rutas)
app.use(errorHandler);

// ==================== INICIO DEL SERVIDOR ====================

const PORT = process.env.PORT || 3000;

// Primero conectamos a la BD, luego iniciamos el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
});
