// ============================================================
// sale.routes.js - Rutas de Express para Ventas
// ============================================================
// Define los endpoints de la API para el CRUD de ventas.
// Todas las rutas están protegidas con el middleware de auth.
// ============================================================

const express = require('express');
const router = express.Router();

const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
} = require('../db/actions/sale.actions');

const authMiddleware = require('../middlewares/auth.middleware');

/**
 * POST /sales/create - Registrar una nueva venta
 * La validación de existencia de usuario/producto se hace en sale.actions.js
 */
router.post('/create', authMiddleware, async (req, res, next) => {
  try {
    const newSale = await createSale(req.body);
    res.status(201).json(newSale);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /sales - Obtener todas las ventas (con populate)
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const sales = await getAllSales();
    res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /sales/:id - Obtener una venta por ID (con populate)
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const sale = await getSaleById(req.params.id);
    res.status(200).json(sale);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /sales/:id - Actualizar una venta
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const updatedSale = await updateSale(req.params.id, req.body);
    res.status(200).json(updatedSale);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /sales/:id - Eliminar una venta
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await deleteSale(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
