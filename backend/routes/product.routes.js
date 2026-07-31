// ============================================================
// product.routes.js - Rutas de Express para Productos
// ============================================================
// Define los endpoints de la API para el CRUD de productos.
// Todas las rutas están protegidas con el middleware de auth.
// ============================================================

const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../db/actions/product.actions');

const authMiddleware = require('../middlewares/auth.middleware');

/**
 * POST /products/create - Crear un nuevo producto
 */
router.post('/create', authMiddleware, async (req, res, next) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /products - Obtener todos los productos
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /products/:id - Obtener un producto por ID
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /products/:id - Actualizar un producto
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /products/:id - Eliminar un producto
 * La validación de ventas asociadas se hace en product.actions.js
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
