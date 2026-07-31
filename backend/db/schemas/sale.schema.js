// ============================================================
// sale.schema.js - Modelo de Venta (Mongoose)
// ============================================================
// Define la estructura de los documentos de ventas en MongoDB.
// Usa referencias (ref) a User y Product para relacionar entidades.
// ============================================================

const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID de un usuario
    ref: 'User',                           // Nombre del modelo referenciado
    required: [true, 'El usuario es obligatorio']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID de un producto
    ref: 'Product',                        // Nombre del modelo referenciado
    required: [true, 'El producto es obligatorio']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad mínima es 1']
  },
  totalPrice: {
    type: Number,
    required: [true, 'El precio total es obligatorio'],
    min: [0, 'El precio total no puede ser negativo']
  },
  date: {
    type: Date,
    default: Date.now // Si no se envía fecha, usa la fecha actual
  }
}, {
  timestamps: true
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
