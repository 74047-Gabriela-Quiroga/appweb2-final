// ============================================================
// user.actions.js - Operaciones de base de datos para Usuarios
// ============================================================
// Contiene todas las funciones CRUD + login para la entidad User.
// Aquí se aplica la REGLA DE NEGOCIO: no eliminar usuario con ventas.
// ============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schemas/user.schema');
const Sale = require('../schemas/sale.schema');

/**
 * createUser - Registra un nuevo usuario con contraseña encriptada
 * @param {Object} userData - Datos del usuario (username, password, name)
 * @returns {Object} Usuario creado (sin la contraseña)
 */
const createUser = async (userData) => {
  const { username, password, name } = userData;

  // Verificamos si ya existe un usuario con ese username
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw { status: 400, message: 'El nombre de usuario ya está en uso' };
  }

  // Hasheamos (encriptamos) la contraseña con bcrypt
  // El número 10 es el "salt rounds" (rondas de encriptación)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creamos el usuario con la contraseña encriptada
  const newUser = await User.create({
    username,
    password: hashedPassword,
    name
  });

  // Devolvemos el usuario sin la contraseña por seguridad
  return {
    _id: newUser._id,
    username: newUser.username,
    name: newUser.name
  };
};

/**
 * loginUser - Autentica un usuario y devuelve un token JWT
 * @param {String} username - Nombre de usuario
 * @param {String} password - Contraseña en texto plano
 * @returns {Object} Token JWT y datos del usuario
 */
const loginUser = async (username, password) => {
  // Buscamos el usuario por username
  const user = await User.findOne({ username });
  if (!user) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  // Comparamos la contraseña enviada con la almacenada (hasheada)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  // Generamos un token JWT con el id y username del usuario
  // El token expira en 24 horas
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      name: user.name
    }
  };
};

/**
 * getAllUsers - Obtiene todos los usuarios (sin contraseñas)
 * @returns {Array} Lista de usuarios
 */
const getAllUsers = async () => {
  // El .select('-password') excluye el campo password del resultado
  const users = await User.find().select('-password');
  return users;
};

/**
 * getUserById - Obtiene un usuario por su ID
 * @param {String} id - ID del usuario
 * @returns {Object} Datos del usuario
 */
const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }
  return user;
};

/**
 * updateUser - Actualiza los datos de un usuario
 * @param {String} id - ID del usuario a actualizar
 * @param {Object} userData - Nuevos datos
 * @returns {Object} Usuario actualizado
 */
const updateUser = async (id, userData) => {
  // Si se envía una nueva contraseña, la encriptamos
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  // findByIdAndUpdate con { new: true } devuelve el documento actualizado
  const updatedUser = await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true // Ejecuta las validaciones del esquema
  }).select('-password');

  if (!updatedUser) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }

  return updatedUser;
};

/**
 * deleteUser - Elimina un usuario
 * REGLA DE NEGOCIO: No permite eliminar si tiene ventas asociadas
 * @param {String} id - ID del usuario a eliminar
 * @returns {Object} Mensaje de confirmación
 */
const deleteUser = async (id) => {
  // Verificamos que el usuario exista
  const user = await User.findById(id);
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }

  // REGLA DE NEGOCIO: Verificamos si el usuario tiene ventas registradas
  const salesCount = await Sale.countDocuments({ user: id });
  if (salesCount > 0) {
    throw {
      status: 400,
      message: `No se puede eliminar el usuario porque tiene ${salesCount} venta(s) registrada(s)`
    };
  }

  // Si no tiene ventas, procedemos a eliminar
  await User.findByIdAndDelete(id);
  return { message: 'Usuario eliminado correctamente' };
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
