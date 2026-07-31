// ============================================================
// sale.actions.js - Operaciones de base de datos para Ventas
// ============================================================
// Contiene las funciones CRUD para la entidad Sale.
// REGLA DE NEGOCIO: Validar existencia de usuario y producto antes
// de registrar una venta.
// Usa .populate() para traer los datos completos de user y product.
// ============================================================

const Sale = require('../schemas/sale.schema');
const User = require('../schemas/user.schema');
const Product = require('../schemas/product.schema');

/**
 * createSale - Registra una nueva venta
 * REGLA DE NEGOCIO: Valida que existan el usuario y el producto
 * @param {Object} saleData - Datos de la venta
 * @returns {Object} Venta creada (con populate)
 */
const createSale = async (saleData) => {
  const { user, product, quantity, totalPrice } = saleData;

  // REGLA DE NEGOCIO: Verificamos que el usuario exista
  const existingUser = await User.findById(user);
  if (!existingUser) {
    throw { status: 404, message: 'El usuario especificado no existe' };
  }

  // REGLA DE NEGOCIO: Verificamos que el producto exista
  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    throw { status: 404, message: 'El producto especificado no existe' };
  }

  // Creamos la venta
  const newSale = await Sale.create({
    user,
    product,
    quantity,
    totalPrice
  });

  // Hacemos populate para devolver los datos completos del usuario y producto
  // populate() reemplaza el ObjectId por el documento completo
  const populatedSale = await Sale.findById(newSale._id)
    .populate('user', 'username name')    // Solo traemos username y name
    .populate('product', 'name price');   // Solo traemos name y price

  return populatedSale;
};

/**
 * getAllSales - Obtiene todas las ventas con datos de usuario y producto
 * @returns {Array} Lista de ventas (con populate)
 */
const getAllSales = async () => {
  // populate() trae los datos relacionados en vez de solo el ID
  const sales = await Sale.find()
    .populate('user', 'username name')
    .populate('product', 'name price');
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
    .populate('product', 'name price');

  if (!sale) {
    throw { status: 404, message: 'Venta no encontrada' };
  }

  return sale;
};

/**
 * updateSale - Actualiza los datos de una venta
 * @param {String} id - ID de la venta a actualizar
 * @param {Object} saleData - Nuevos datos de la venta
 * @returns {Object} Venta actualizada (con populate)
 */
const updateSale = async (id, saleData) => {
  // Si se cambia el usuario, verificamos que exista
  if (saleData.user) {
    const existingUser = await User.findById(saleData.user);
    if (!existingUser) {
      throw { status: 404, message: 'El usuario especificado no existe' };
    }
  }

  // Si se cambia el producto, verificamos que exista
  if (saleData.product) {
    const existingProduct = await Product.findById(saleData.product);
    if (!existingProduct) {
      throw { status: 404, message: 'El producto especificado no existe' };
    }
  }

  const updatedSale = await Sale.findByIdAndUpdate(id, saleData, {
    new: true,
    runValidators: true
  })
    .populate('user', 'username name')
    .populate('product', 'name price');

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
