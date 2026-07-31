// ============================================================
// product.schema.js - Modelo de Producto (Mongoose)
// ============================================================
// Define la estructura de los documentos de productos en MongoDB.
// Campos: name (único), desc, price, category.
// ============================================================

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    unique: true, // No puede haber dos productos con el mismo nombre
    trim: true
  },
  desc: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
