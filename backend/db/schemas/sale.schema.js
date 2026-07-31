// ============================================================
// sale.schema.js - Modelo de Venta (Mongoose) - Múltiples Productos
// ============================================================
// Define la estructura de los documentos de ventas en MongoDB.
// Ahora soporta MÚLTIPLES productos por venta mediante un array de items.
// ============================================================

const mongoose = require('mongoose');

// Esquema para cada ítem de producto dentro de una venta
const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al producto
    ref: 'Product',
    required: [true, 'El producto es obligatorio']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad mínima es 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'El precio unitario es obligatorio'],
    min: [0, 'El precio unitario no puede ser negativo']
  }
}, { _id: false }); // No necesitamos ID individual para cada ítem del array

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al usuario comprador
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  products: {
    type: [saleItemSchema], // Array de ítems (múltiples productos)
    validate: [
      array => array.length > 0,
      'Una venta debe incluir al menos un producto'
    ]
  },
  totalPrice: {
    type: Number,
    required: [true, 'El precio total es obligatorio'],
    min: [0, 'El precio total no puede ser negativo']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
