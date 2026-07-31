// ============================================================
// sale.actions.js - Operaciones de base de datos para Ventas (Múltiples Productos)
// ============================================================
// Contiene las funciones CRUD para la entidad Sale.
// REGLA DE NEGOCIO: Validar existencia de usuario y de cada producto
// antes de registrar o modificar una venta.
// Usa .populate() para traer los datos de user y de cada producto en products.
// ============================================================

const Sale = require('../schemas/sale.schema');
const User = require('../schemas/user.schema');
const Product = require('../schemas/product.schema');

/**
 * createSale - Registra una nueva venta con múltiples productos
 * REGLA DE NEGOCIO: Valida que existan el usuario y todos los productos
 * @param {Object} saleData - { user, products: [{ product, quantity, unitPrice }], totalPrice }
 * @returns {Object} Venta creada (con populate)
 */
const createSale = async (saleData) => {
  const { user, products, totalPrice } = saleData;

  // REGLA DE NEGOCIO: Verificamos que el usuario exista
  const existingUser = await User.findById(user);
  if (!existingUser) {
    throw { status: 404, message: 'El usuario especificado no existe' };
  }

  // Verificamos que se haya enviado al menos un producto
  if (!products || !Array.isArray(products) || products.length === 0) {
    throw { status: 400, message: 'La venta debe contener al menos un producto' };
  }

  // REGLA DE NEGOCIO: Verificamos que todos los productos existan
  for (const item of products) {
    const existingProduct = await Product.findById(item.product);
    if (!existingProduct) {
      throw { status: 404, message: `El producto especificado (ID: ${item.product}) no existe` };
    }
  }

  // Creamos la venta
  const newSale = await Sale.create({
    user,
    products,
    totalPrice
  });

  // Hacemos populate del usuario y de cada producto dentro del array products
  const populatedSale = await Sale.findById(newSale._id)
    .populate('user', 'username name')
    .populate('products.product', 'name price category');

  return populatedSale;
};

/**
 * getAllSales - Obtiene todas las ventas con datos poblados de usuario y productos
 * @returns {Array} Lista de ventas (con populate)
 */
const getAllSales = async () => {
  const sales = await Sale.find()
    .populate('user', 'username name')
    .populate('products.product', 'name price category');
  return sales;
};

/**
 * getSaleById - Obtiene una venta por su ID
 * @param {String} id - ID de la venta
 * @returns {Object} Datos de la venta (con populate)
 */
const getSaleById = async (id) => {
  const sale = await Sale.findById(id)
    .populate('user', 'username name')
    .populate('products.product', 'name price category');

  if (!sale) {
    throw { status: 404, message: 'Venta no encontrada' };
  }

  return sale;
};

/**
 * updateSale - Actualiza los datos de una venta
 * @param {String} id - ID de la venta a actualizar
 * @param {Object} saleData - Nuevos datos
 * @returns {Object} Venta actualizada (con populate)
 */
const updateSale = async (id, saleData) => {
  if (saleData.user) {
    const existingUser = await User.findById(saleData.user);
    if (!existingUser) {
      throw { status: 404, message: 'El usuario especificado no existe' };
    }
  }

  if (saleData.products && Array.isArray(saleData.products)) {
    if (saleData.products.length === 0) {
      throw { status: 400, message: 'La venta debe contener al menos un producto' };
    }
    for (const item of saleData.products) {
      const existingProduct = await Product.findById(item.product);
      if (!existingProduct) {
        throw { status: 404, message: `El producto especificado (ID: ${item.product}) no existe` };
      }
    }
  }

  const updatedSale = await Sale.findByIdAndUpdate(id, saleData, {
    new: true,
    runValidators: true
  })
    .populate('user', 'username name')
    .populate('products.product', 'name price category');

  if (!updatedSale) {
    throw { status: 404, message: 'Venta no encontrada' };
  }

  return updatedSale;
};

/**
 * deleteSale - Elimina una venta
 * @param {String} id - ID de la venta a eliminar
 * @returns {Object} Mensaje de confirmación
 */
const deleteSale = async (id) => {
  const sale = await Sale.findById(id);
  if (!sale) {
    throw { status: 404, message: 'Venta no encontrada' };
  }

  await Sale.findByIdAndDelete(id);
  return { message: 'Venta eliminada correctamente' };
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
};
