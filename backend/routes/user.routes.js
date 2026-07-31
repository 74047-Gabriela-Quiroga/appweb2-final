// ============================================================
// user.routes.js - Rutas de Express para Usuarios
// ============================================================
// Define los endpoints de la API para el CRUD de usuarios
// y la autenticación (registro y login).
// Las rutas públicas (register/login) no requieren token.
// Las rutas privadas usan el middleware auth.
// ============================================================

const express = require('express');
const router = express.Router();

// Importamos las funciones de la capa de acciones
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../db/actions/user.actions');

// Importamos el middleware de autenticación
const authMiddleware = require('../middlewares/auth.middleware');

// ==================== RUTAS PÚBLICAS ====================

/**
 * POST /users/register - Registro de nuevo usuario
 * No requiere autenticación (es público)
 */
router.post('/register', async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    // 201 = Created (recurso creado exitosamente)
    res.status(201).json(newUser);
  } catch (error) {
    // next(error) envía el error al middleware centralizado
    next(error);
  }
});

/**
 * POST /users/login - Inicio de sesión
 * Devuelve un token JWT si las credenciales son correctas
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    // 200 = OK
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// ==================== RUTAS PRIVADAS (requieren token) ====================

/**
 * GET /users - Obtener todos los usuarios
 * authMiddleware verifica el token antes de ejecutar la función
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /users/:id - Obtener un usuario por ID
 * :id es un parámetro de ruta dinámico
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /users/:id - Actualizar un usuario
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /users/:id - Eliminar un usuario
 * La validación de ventas asociadas se hace en user.actions.js
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
