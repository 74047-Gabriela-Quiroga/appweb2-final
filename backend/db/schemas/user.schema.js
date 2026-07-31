// ============================================================
// user.schema.js - Modelo de Usuario (Mongoose)
// ============================================================
// Define la estructura de los documentos de usuarios en MongoDB.
// Campos: username (único), password (se hashea con bcrypt), name.
// ============================================================

const mongoose = require('mongoose');

// Definimos el esquema (la "forma" que tendrán los documentos)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true, // No puede haber dos usuarios con el mismo username
    trim: true    // Elimina espacios al inicio y final
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
    // La contraseña se guarda ya hasheada (encriptada) desde user.actions.js
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  }
}, {
  // timestamps agrega automáticamente createdAt y updatedAt
  timestamps: true
});

// Creamos y exportamos el modelo basado en el esquema
// "User" será el nombre de la colección en MongoDB (en plural: "users")
const User = mongoose.model('User', userSchema);

module.exports = User;
