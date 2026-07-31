// ============================================================
// product.actions.js - Operaciones de base de datos para Productos
// ============================================================
// Contiene las funciones CRUD para la entidad Product.
// REGLA DE NEGOCIO: no eliminar producto con ventas asociadas.
// ============================================================

const Product = require('../schemas/product.schema');
const Sale = require('../schemas/sale.schema');

/**
 * createProduct - Crea un nuevo producto
 * @param {Object} productData - Datos del producto
 * @returns {Object} Producto creado
 */
const createProduct = async (productData) => {
  const { name } = productData;

  // Verificamos si ya existe un producto con ese nombre
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw { status: 400, message: 'Ya existe un producto con ese nombre' };
  }

  const newProduct = await Product.create(productData);
  return newProduct;
};

/**
 * getAllProducts - Obtiene todos los productos
 * @returns {Array} Lista de productos
 */
const getAllProducts = async () => {
  const products = await Product.find();
  return products;
};

/**
 * getProductById - Obtiene un producto por su ID
 * @param {String} id - ID del producto
 * @returns {Object} Datos del producto
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw { status: 404, message: 'Producto no encontrado' };
  }
  return product;
};

/**
 * updateProduct - Actualiza los datos de un producto
 * @param {String} id - ID del producto a actualizar
 * @param {Object} productData - Nuevos datos del producto
 * @returns {Object} Producto actualizado
 */
const updateProduct = async (id, productData) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
    new: true,           // Devuelve el documento actualizado
    runValidators: true  // Ejecuta validaciones del esquema
  });

  if (!updatedProduct) {
    throw { status: 404, message: 'Producto no encontrado' };
  }

  return updatedProduct;
};

/**
 * deleteProduct - Elimina un producto
 * REGLA DE NEGOCIO: No permite eliminar si tiene ventas asociadas
 * @param {String} id - ID del producto a eliminar
 * @returns {Object} Mensaje de confirmación
 */
const deleteProduct = async (id) => {
  // Verificamos que el producto exista
  const product = await Product.findById(id);
  if (!product) {
    throw { status: 404, message: 'Producto no encontrado' };
  }

  // REGLA DE NEGOCIO: Verificamos si el producto tiene ventas asociadas
  const salesCount = await Sale.countDocuments({ product: id });
  if (salesCount > 0) {
    throw {
      status: 400,
      message: `No se puede eliminar el producto porque tiene ${salesCount} venta(s) asociada(s)`
    };
  }

  // Si no tiene ventas, procedemos a eliminar
  await Product.findByIdAndDelete(id);
  return { message: 'Producto eliminado correctamente' };
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
