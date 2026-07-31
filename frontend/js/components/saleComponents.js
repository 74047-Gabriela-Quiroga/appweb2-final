// ============================================================
// saleComponents.js - Componentes HTML para la sección Ventas
// ============================================================
// Funciones que retornan strings de HTML para renderizar
// la tabla de ventas y los formularios de crear/editar.
// Los selects de usuario y producto se llenan dinámicamente.
// ============================================================

/**
 * renderSalesSection - Genera el HTML de la sección Ventas
 * @param {Array} sales - Lista de ventas (con populate)
 * @returns {String} HTML de la sección
 */
export const renderSalesSection = (sales) => {
  // Calculamos el total de todas las ventas
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return `
    <div class="section-view">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-surface-900">🧾 Ventas</h2>
          <p class="text-surface-500 text-sm mt-1">Registro de todas las ventas realizadas</p>
        </div>
        <button onclick="openCreateSaleModal()" id="btn-create-sale"
          class="btn-primary px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md text-sm flex items-center gap-2">
          <span>+</span> Nueva Venta
        </button>
      </div>

      <!-- Cards de estadísticas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div class="glass-card rounded-xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <span class="text-lg">🧾</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">${sales.length}</p>
            <p class="text-xs text-surface-500">Total ventas</p>
          </div>
        </div>
        <div class="glass-card rounded-xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <span class="text-lg">💰</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
            <p class="text-xs text-surface-500">Ingresos totales</p>
          </div>
        </div>
      </div>

      <!-- Tabla de ventas -->
      <div class="glass-card rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full" id="sales-table">
            <thead>
              <tr class="bg-surface-50 border-b border-surface-200">
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Fecha</th>
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Usuario</th>
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Producto</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Cantidad</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Total</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100">
              ${sales.length === 0
                ? `<tr><td colspan="6" class="text-center py-12 text-surface-400">No hay ventas registradas</td></tr>`
                : sales.map(sale => renderSaleRow(sale)).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

/**
 * renderSaleRow - Genera una fila de tabla para una venta
 * @param {Object} sale - Datos de la venta (con populate)
 * @returns {String} HTML de la fila
 */
const renderSaleRow = (sale) => {
  // Formateamos la fecha
  const saleDate = new Date(sale.date).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Datos del usuario y producto (vienen del populate)
  const userName = sale.user ? sale.user.name : 'Usuario eliminado';
  const productName = sale.product ? sale.product.name : 'Producto eliminado';

  return `
    <tr class="table-row-hover">
      <td class="py-3.5 px-5 text-sm text-surface-600">${saleDate}</td>
      <td class="py-3.5 px-5">
        <span class="text-sm font-medium text-surface-800">${userName}</span>
      </td>
      <td class="py-3.5 px-5">
        <span class="text-sm text-surface-700">${productName}</span>
      </td>
      <td class="py-3.5 px-5 text-right">
        <span class="text-sm font-medium text-surface-800">${sale.quantity}</span>
      </td>
      <td class="py-3.5 px-5 text-right">
        <span class="font-semibold text-green-600 text-sm">$${sale.totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
      </td>
      <td class="py-3.5 px-5">
        <div class="flex justify-end gap-2">
          <button onclick="openEditSaleModal('${sale._id}')" title="Editar"
            class="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm">
            ✏️
          </button>
          <button onclick="handleDeleteSale('${sale._id}')" title="Eliminar"
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
};

/**
 * renderSaleFormModal - Genera el formulario para crear/editar venta
 * Los selects de usuario y producto se llenan con datos de la API.
 * @param {Array} users - Lista de usuarios para el select
 * @param {Array} products - Lista de productos para el select
 * @param {Object|null} sale - null para crear, con datos para editar
 * @returns {String} HTML del formulario
 */
export const renderSaleFormModal = (users, products, sale = null) => {
  const isEdit = sale !== null;
  const title = isEdit ? 'Editar Venta' : 'Nueva Venta';
  const buttonText = isEdit ? 'Guardar Cambios' : 'Registrar Venta';

  // Generamos las opciones del select de usuarios
  const userOptions = users.map(user =>
    `<option value="${user._id}" ${isEdit && sale.user && sale.user._id === user._id ? 'selected' : ''}>
      ${user.name} (@${user.username})
    </option>`
  ).join('');

  // Generamos las opciones del select de productos
  const productOptions = products.map(product =>
    `<option value="${product._id}" data-price="${product.price}" ${isEdit && sale.product && sale.product._id === product._id ? 'selected' : ''}>
      ${product.name} - $${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
    </option>`
  ).join('');

  return `
    <div>
      <h3 class="text-xl font-bold text-surface-900 mb-1">${title}</h3>
      <p class="text-surface-500 text-sm mb-6">${isEdit ? 'Modifique los datos de la venta' : 'Complete los datos de la nueva venta'}</p>

      <form id="sale-form" onsubmit="handleSaveSale(event, '${isEdit ? sale._id : ''}')" class="space-y-4">
        <div>
          <label for="form-sale-user" class="block text-sm font-medium text-surface-700 mb-1.5">Usuario</label>
          <select id="form-sale-user" required
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Seleccionar usuario...</option>
            ${userOptions}
          </select>
        </div>
        <div>
          <label for="form-sale-product" class="block text-sm font-medium text-surface-700 mb-1.5">Producto</label>
          <select id="form-sale-product" required onchange="handleProductSelectChange()"
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Seleccionar producto...</option>
            ${productOptions}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="form-sale-quantity" class="block text-sm font-medium text-surface-700 mb-1.5">Cantidad</label>
            <input type="number" id="form-sale-quantity" required min="1" value="${isEdit ? sale.quantity : '1'}"
              onchange="calculateTotal()" oninput="calculateTotal()"
              class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
          <div>
            <label for="form-sale-total" class="block text-sm font-medium text-surface-700 mb-1.5">Precio Total ($)</label>
            <input type="number" id="form-sale-total" required min="0" step="0.01" value="${isEdit ? sale.totalPrice : ''}" placeholder="0.00"
              class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
        </div>

        <div id="form-sale-error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl"></div>

        <div class="flex gap-3 pt-2">
          <button type="button" onclick="closeModal()"
            class="flex-1 py-2.5 bg-surface-100 text-surface-700 font-semibold rounded-xl hover:bg-surface-200 transition-colors duration-200 text-sm">
            Cancelar
          </button>
          <button type="submit"
            class="btn-primary flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md text-sm">
            ${buttonText}
          </button>
        </div>
      </form>
    </div>
  `;
};
