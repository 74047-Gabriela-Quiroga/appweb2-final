// ============================================================
// sales.js - Servicio de peticiones fetch para Ventas
// ============================================================
// Funciones que hacen peticiones HTTP al backend para el CRUD
// de ventas. Todas las rutas requieren autenticación.
// ============================================================

// Importamos la URL base centralizada
import { API_URL } from '../config.js';


const getToken = () => localStorage.getItem('token');

/**
 * createSale - Registra una nueva venta
 * @param {Object} saleData - { user, product, quantity, totalPrice }
 * @returns {Object} Venta creada (con populate)
 */
export const createSale = async (saleData) => {
  const response = await fetch(`${API_URL}/sales/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(saleData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al crear venta');
  }

  return data;
};

/**
 * getAllSales - Obtiene todas las ventas (con populate de user y product)
 * @returns {Array} Lista de ventas
 */
export const getAllSales = async () => {
  const response = await fetch(`${API_URL}/sales`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al obtener ventas');
  }

  return data;
};

/**
 * getSaleById - Obtiene una venta por ID
 * @param {String} id - ID de la venta
 * @returns {Object} Datos de la venta (con populate)
 */
export const getSaleById = async (id) => {
  const response = await fetch(`${API_URL}/sales/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al obtener venta');
  }

  return data;
};

/**
 * updateSale - Actualiza una venta
 * @param {String} id - ID de la venta
 * @param {Object} saleData - Nuevos datos
 * @returns {Object} Venta actualizada
 */
export const updateSale = async (id, saleData) => {
  const response = await fetch(`${API_URL}/sales/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(saleData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al actualizar venta');
  }

  return data;
};

/**
 * deleteSale - Elimina una venta
 * @param {String} id - ID de la venta
 * @returns {Object} Mensaje de confirmación
 */
export const deleteSale = async (id) => {
  const response = await fetch(`${API_URL}/sales/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al eliminar venta');
  }

  return data;
};
