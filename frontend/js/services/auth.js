// ============================================================
// auth.js - Servicio de peticiones fetch para Usuarios
// ============================================================
// Contiene las funciones que hacen peticiones HTTP al backend
// para registro, login y CRUD de usuarios.
// ============================================================

// Importamos la URL base centralizada
import { API_URL } from '../config.js';


/**
 * getToken - Obtiene el token JWT guardado en localStorage
 * @returns {String|null} Token JWT o null si no existe
 */
const getToken = () => localStorage.getItem('token');

/**
 * registerUser - Registra un nuevo usuario
 * @param {Object} userData - { username, password, name }
 * @returns {Object} Datos del usuario creado
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  // Si la respuesta no es exitosa, lanzamos el error
  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al registrar usuario');
  }

  return data;
};

/**
 * loginUser - Inicia sesión y obtiene el token JWT
 * @param {String} username - Nombre de usuario
 * @param {String} password - Contraseña
 * @returns {Object} { token, user }
 */
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al iniciar sesión');
  }

  // Guardamos el token y los datos del usuario en localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

/**
 * getAllUsers - Obtiene todos los usuarios (ruta protegida)
 * @returns {Array} Lista de usuarios
 */
export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`  // Enviamos el token
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al obtener usuarios');
  }

  return data;
};

/**
 * getUserById - Obtiene un usuario por ID
 * @param {String} id - ID del usuario
 * @returns {Object} Datos del usuario
 */
export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al obtener usuario');
  }

  return data;
};

/**
 * updateUser - Actualiza un usuario
 * @param {String} id - ID del usuario
 * @param {Object} userData - Nuevos datos
 * @returns {Object} Usuario actualizado
 */
export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al actualizar usuario');
  }

  return data;
};

/**
 * deleteUser - Elimina un usuario
 * @param {String} id - ID del usuario
 * @returns {Object} Mensaje de confirmación
 */
export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al eliminar usuario');
  }

  return data;
};
