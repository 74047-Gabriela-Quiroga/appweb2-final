// ============================================================
// productComponents.js - Componentes HTML para la sección Productos
// ============================================================
// Funciones que retornan strings de HTML para renderizar
// la tabla de productos y los formularios de crear/editar.
// ============================================================

/**
 * renderProductsSection - Genera el HTML de la sección Productos
 * @param {Array} products - Lista de productos desde la API
 * @returns {String} HTML de la sección
 */
export const renderProductsSection = (products) => {
  return `
    <div class="section-view">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-surface-900">📦 Productos</h2>
          <p class="text-surface-500 text-sm mt-1">Gestión del catálogo de productos</p>
        </div>
        <button onclick="openCreateProductModal()" id="btn-create-product"
          class="btn-primary px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md text-sm flex items-center gap-2">
          <span>+</span> Nuevo Producto
        </button>
      </div>

      <!-- Card de estadística -->
      <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6 max-w-xs">
        <div class="glass-card rounded-xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <span class="text-lg">📦</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">${products.length}</p>
            <p class="text-xs text-surface-500">Total productos</p>
          </div>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div class="glass-card rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full" id="products-table">
            <thead>
              <tr class="bg-surface-50 border-b border-surface-200">
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Producto</th>
                <th class="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Categoría</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Precio</th>
                <th class="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100">
              ${products.length === 0
                ? `<tr><td colspan="4" class="text-center py-12 text-surface-400">No hay productos registrados</td></tr>`
                : products.map(product => renderProductRow(product)).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

/**
 * renderProductRow - Genera una fila de tabla para un producto
 * @param {Object} product - Datos del producto
 * @returns {String} HTML de la fila
 */
const renderProductRow = (product) => {
  return `
    <tr class="table-row-hover">
      <td class="py-3.5 px-5">
        <div>
          <p class="font-medium text-surface-800 text-sm">${product.name}</p>
          <p class="text-xs text-surface-400 mt-0.5 truncate max-w-xs">${product.desc}</p>
        </div>
      </td>
      <td class="py-3.5 px-5">
        <span class="text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg">${product.category}</span>
      </td>
      <td class="py-3.5 px-5 text-right">
        <span class="font-semibold text-surface-800 text-sm">$${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
      </td>
      <td class="py-3.5 px-5">
        <div class="flex justify-end gap-2">
          <button onclick="openEditProductModal('${product._id}')" title="Editar"
            class="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm">
            ✏️
          </button>
          <button onclick="handleDeleteProduct('${product._id}')" title="Eliminar"
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
};

/**
 * renderProductFormModal - Genera el formulario para crear/editar producto
 * @param {Object|null} product - null para crear, con datos para editar
 * @returns {String} HTML del formulario
 */
export const renderProductFormModal = (product = null) => {
  const isEdit = product !== null;
  const title = isEdit ? 'Editar Producto' : 'Nuevo Producto';
  const buttonText = isEdit ? 'Guardar Cambios' : 'Crear Producto';

  return `
    <div>
      <h3 class="text-xl font-bold text-surface-900 mb-1">${title}</h3>
      <p class="text-surface-500 text-sm mb-6">${isEdit ? 'Modifique los datos del producto' : 'Complete los datos del nuevo producto'}</p>

      <form id="product-form" onsubmit="handleSaveProduct(event, '${isEdit ? product._id : ''}')" class="space-y-4">
        <div>
          <label for="form-product-name" class="block text-sm font-medium text-surface-700 mb-1.5">Nombre del producto</label>
          <input type="text" id="form-product-name" required value="${isEdit ? product.name : ''}" placeholder="Ej: Notebook Lenovo"
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        </div>
        <div>
          <label for="form-product-desc" class="block text-sm font-medium text-surface-700 mb-1.5">Descripción</label>
          <textarea id="form-product-desc" required rows="2" placeholder="Descripción del producto"
            class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none">${isEdit ? product.desc : ''}</textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="form-product-price" class="block text-sm font-medium text-surface-700 mb-1.5">Precio ($)</label>
            <input type="number" id="form-product-price" required min="0" step="0.01" value="${isEdit ? product.price : ''}" placeholder="0.00"
              class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
          <div>
            <label for="form-product-category" class="block text-sm font-medium text-surface-700 mb-1.5">Categoría</label>
            <input type="text" id="form-product-category" required value="${isEdit ? product.category : ''}" placeholder="Ej: Electrónica"
              class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
        </div>

        <div id="form-product-error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl"></div>

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
