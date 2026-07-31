// ============================================================
// products.js - Servicio de peticiones fetch para Productos
// ============================================================
// Funciones que hacen peticiones HTTP al backend para el CRUD
// de productos. Todas las rutas requieren autenticación.
// ============================================================

// Importamos la URL base centralizada
import { API_URL } from '../config.js';


// Función helper para obtener el token
const getToken = () => localStorage.getItem('token');

/**
 * createProduct - Crea un nuevo producto
 * @param {Object} productData - { name, desc, price, stock, category }
 * @returns {Object} Producto creado
 */
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al crear producto');
  }

  return data;
};

/**
 * getAllProducts - Obtiene todos los productos
 * @returns {Array} Lista de productos
 */
export const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al obtener productos');
  }

  return data;
};

/**
 * getProductById - Obtiene un producto por ID
 * @param {String} id - ID del producto
 * @returns {Object} Datos del producto
 */
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al obtener producto');
  }

  return data;
};

/**
 * updateProduct - Actualiza un producto
 * @param {String} id - ID del producto
 * @param {Object} productData - Nuevos datos
 * @returns {Object} Producto actualizado
 */
export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al actualizar producto');
  }

  return data;
};

/**
 * deleteProduct - Elimina un producto
 * @param {String} id - ID del producto
 * @returns {Object} Mensaje de confirmación
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al eliminar producto');
  }

  return data;
};
