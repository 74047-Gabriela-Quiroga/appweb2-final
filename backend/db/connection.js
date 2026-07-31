// ============================================================
// connection.js - Conexión a MongoDB Atlas con Mongoose
// ============================================================
// Este archivo se encarga de conectar nuestra app a la base de datos.
// Usa una variable "cached" para no crear múltiples conexiones.
// ============================================================

const mongoose = require('mongoose');

// Variable para guardar la conexión en caché (evita reconexiones innecesarias)
let cached = null;

/**
 * connectDB - Conecta a MongoDB Atlas usando la URI del archivo .env
 * Si ya existe una conexión activa, la reutiliza (patrón caché).
 */
const connectDB = async () => {
  // Si ya tenemos una conexión guardada, la devolvemos directamente
  if (cached) {
    console.log('📦 Usando conexión a MongoDB en caché');
    return cached;
  }

  try {
    // mongoose.connect() establece la conexión con la URI de MongoDB Atlas
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    // Guardamos la conexión en caché para reutilizarla
    cached = connection;
    console.log('✅ Conectado a MongoDB Atlas correctamente');

    return cached;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    // Si falla la conexión, terminamos el proceso
    process.exit(1);
  }
};

module.exports = { connectDB };
