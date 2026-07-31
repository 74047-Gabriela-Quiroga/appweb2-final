// ============================================================
// saleComponents.js - Componentes HTML para Ventas (Múltiples Productos)
// ============================================================
// Funciones que retornan HTML para renderizar la tabla de ventas
// y el formulario dinámico con múltiples ítems de productos.
// ============================================================

/**
 * renderSalesSection - Genera el HTML de la sección Ventas
 * @param {Array} sales - Lista de ventas (con populate)
 * @returns {String} HTML de la sección
 */
export const renderSalesSection = (sales) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

  return `
    <div class="section-view">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-surface-900">🧾 Ventas</h2>
          <p class="text-surface-500 text-sm mt-1">Registro de ventas realizadas con múltiples productos</p>
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
            <p class="text-xs text-surface-500">Total de ventas</p>
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
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Productos</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Total</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100">
              ${sales.length === 0
                ? `<tr><td colspan="5" class="text-center py-12 text-surface-400">No hay ventas registradas</td></tr>`
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
 * renderSaleRow - Genera una fila de la tabla para una venta
 * @param {Object} sale - Datos de la venta (con populate)
 * @returns {String} HTML de la fila
 */
const renderSaleRow = (sale) => {
  const saleDate = new Date(sale.date).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const userName = sale.user ? sale.user.name : 'Usuario eliminado';

  // Formateamos la lista de productos
  let productsHtml = '';
  if (sale.products && sale.products.length > 0) {
    productsHtml = sale.products.map(item => {
      const pName = item.product ? item.product.name : 'Producto eliminado';
      return `<div class="text-xs text-surface-700 font-medium">
        <span class="text-primary-600 font-bold">${item.quantity}x</span> ${pName} ($${item.unitPrice})
      </div>`;
    }).join('');
  } else {
    productsHtml = `<span class="text-xs text-surface-400">Sin productos</span>`;
  }

  return `
    <tr class="table-row-hover">
      <td class="py-3.5 px-5 text-sm text-surface-600">${saleDate}</td>
      <td class="py-3.5 px-5">
        <span class="text-sm font-medium text-surface-800">${userName}</span>
      </td>
      <td class="py-3.5 px-5">
        <div class="space-y-1">${productsHtml}</div>
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
 * renderSaleFormModal - Genera el formulario para crear/editar venta con múltiples productos
 * @param {Array} users - Lista de usuarios
 * @param {Array} products - Lista de productos
 * @param {Object|null} sale - null para crear, objeto con datos para editar
 * @returns {String} HTML del formulario
 */
export const renderSaleFormModal = (users, products, sale = null) => {
  const isEdit = sale !== null;
  const title = isEdit ? 'Editar Venta' : 'Nueva Venta';
  const buttonText = isEdit ? 'Guardar Cambios' : 'Registrar Venta';

  // Guardamos la lista de productos en window para usarla al agregar nuevas filas dinámicas
  window.availableProducts = products;

  const userOptions = users.map(user =>
    `<option value="${user._id}" ${isEdit && sale.user && (sale.user._id === user._id || sale.user === user._id) ? 'selected' : ''}>
      ${user.name} (@${user.username})
    </option>`
  ).join('');

  // Filas iniciales de productos
  let productRowsHtml = '';
  if (isEdit && sale.products && sale.products.length > 0) {
    productRowsHtml = sale.products.map((item, index) => renderProductRowInput(products, item, index)).join('');
  } else {
    // Para nueva venta, iniciamos con 1 fila
    productRowsHtml = renderProductRowInput(products, null, 0);
  }

  return `
    <div>
      <h3 class="text-xl font-bold text-surface-900 mb-1">${title}</h3>
      <p class="text-surface-500 text-sm mb-6">${isEdit ? 'Modifique los productos de la venta' : 'Seleccione el cliente y agregue uno o más productos'}</p>

      <form id="sale-form" onsubmit="handleSaveSale(event, '${isEdit ? sale._id : ''}')" class="space-y-4">
        <!-- Usuario -->
        <div>
          <label for="form-sale-user" class="block text-sm font-medium text-surface-700 mb-1.5">Cliente / Usuario</label>
          <select id="form-sale-user" required
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Seleccionar cliente...</option>
            ${userOptions}
          </select>
        </div>

        <!-- Lista de productos de la venta -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-surface-700">Productos de la Venta</label>
            <button type="button" onclick="addProductRowToSaleModal()"
              class="text-xs text-primary-600 font-semibold hover:text-primary-800 hover:bg-primary-50 px-2 py-1 rounded-lg transition-colors">
              + Agregar otro producto
            </button>
          </div>

          <div id="sale-products-container" class="space-y-3 max-h-60 overflow-y-auto pr-1">
            ${productRowsHtml}
          </div>
        </div>

        <!-- Total general -->
        <div class="pt-2 border-t border-surface-200 flex justify-between items-center">
          <span class="font-bold text-surface-800 text-base">Total General:</span>
          <div class="flex items-center gap-1">
            <span class="font-bold text-lg text-primary-600">$</span>
            <input type="number" id="form-sale-total" required readonly min="0" step="0.01" value="${isEdit ? sale.totalPrice : '0.00'}"
              class="w-32 px-3 py-1.5 bg-surface-100 font-bold text-lg text-primary-600 border border-surface-200 rounded-xl text-right focus:outline-none">
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

/**
 * renderProductRowInput - Genera el HTML de una fila individual de producto + cantidad en el modal
 * @param {Array} products - Lista de productos disponibles
 * @param {Object|null} item - Datos del ítem (si se está editando)
 * @param {Number} index - Índice de la fila
 * @returns {String} HTML de la fila
 */
export const renderProductRowInput = (products, item = null, index = 0) => {
  const selectedProductId = item && item.product ? (item.product._id || item.product) : '';
  const quantity = item ? item.quantity : 1;
  const unitPrice = item ? item.unitPrice : 0;

  const productOptions = products.map(p => `
    <option value="${p._id}" data-price="${p.price}" ${selectedProductId === p._id ? 'selected' : ''}>
      ${p.name} ($${p.price})
    </option>
  `).join('');

  return `
    <div class="sale-product-row flex items-center gap-2 bg-surface-50 p-2.5 rounded-xl border border-surface-200">
      <select onchange="calculateSaleTotal()" required
        class="product-select flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="" data-price="0">Seleccionar producto...</option>
        ${productOptions}
      </select>

      <div class="w-20">
        <input type="number" min="1" value="${quantity}" oninput="calculateSaleTotal()" onchange="calculateSaleTotal()" required
          class="product-quantity w-full px-2 py-2 bg-white border border-surface-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Cant.">
      </div>

      <button type="button" onclick="removeProductRowFromSaleModal(this)" title="Quitar producto"
        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-xs font-bold transition-colors">
        ✕
      </button>
    </div>
  `;
};
